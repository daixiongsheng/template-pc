import {
  Api,
  Middleware,
  Post,
  useContext,
  useInject,
  Validate,
  useConfig,
  Params,
  Get,
  ApiConfig,
} from '@midwayjs/hooks'
import { JwtService } from '@midwayjs/jwt'
import { Gender, User } from '@prisma/client'
import { JwtPayload } from 'jsonwebtoken'
import { Context } from '@midwayjs/koa'
import { RedisService } from '@midwayjs/redis'
import { HooksMiddleware } from '@midwayjs/hooks-core'
import { z } from 'zod'

import { error, success } from './utils/response'
import { prisma } from './prisma'
import {
  checkUser,
  generatePassword,
  getTokenKey,
  getUserKey,
  pureUser,
} from './utils/user'
import { randomExpire } from './utils'
import { UserInfo } from '../typings/global'

const middleware: HooksMiddleware = async (next) => {
  await next()
}

// File Level Middleware
export const config: ApiConfig = {
  middleware: [middleware],
}

export const login = Api(
  Post('/api/user/login'),
  Validate(z.string(), z.string()),
  async (username: string, password: string) => {
    const ctx = useContext<Context>()
    username = username ?? ctx.request.body?.username
    password = password ?? ctx.request.body?.password
    const user = await prisma.user.findFirst({
      select: {
        id: true,
        password: true,
      },
      where: {
        username: {
          equals: username,
        },
      },
    })
    if (!user || !checkUser(user, password)) {
      return error('用户名或者密码错误')
    }
    const info = {
      id: user.id,
    }
    const {
      jwt: { secret, maxAge },
    } = useConfig()
    const jwt = await useInject(JwtService)
    const token = await jwt.sign(info, secret, {
      expiresIn: maxAge,
    })
    ctx.cookies.set('token', token)
    ;(async () => {
      const redis = await useInject(RedisService)
      redis.set(getTokenKey(user.id), token)
      redis.pexpire(getTokenKey(user.id), maxAge)
    })()
    return success({ token })
  }
)

async function findUser(id: number | string) {
  const userKey = getUserKey(id)
  const redis = await useInject(RedisService)
  let user: User
  const userJsonStr = await redis.get(userKey)
  if (userJsonStr) {
    try {
      user = JSON.parse(userJsonStr) as User
    } catch {}
  }
  if (!user) {
    user = await prisma.user
      .findFirst({
        where: {
          id: +id,
        },
      })
      .catch(() => null)
  }
  if (!user) {
    return null
  }
  redis.set(userKey, JSON.stringify(user))
  redis.expire(userKey, randomExpire())
  return user
}

export const getById = Api(
  Get('/api/user/get_by_id/:id'),
  Params<{ id: string }>(),
  Middleware(middleware),
  async () => {
    const ctx = useContext<Context>()
    // const sg = await useInject(SwaggerMiddleware)
    const { id } = ctx.params
    const user = await findUser(id)
    if (user) {
      return success(pureUser(user))
    }
    return error('User Not Fount')
  }
)

export const getCurrentUserInfo = Api(
  Get('/api/user/get_current_user_info'),
  async () => {
    const uid = await useUid()
    const user = await findUser(uid)
    return success<UserInfo>(pureUser(user))
  }
)

export async function useUid(): Promise<number> {
  const ctx = useContext<Context>()
  const {
    jwt: { secret },
  } = useConfig()
  const token = ctx.cookies.get('token') || ctx.get('token')
  const jwt = await useInject(JwtService)
  const user = (await jwt.verify(token, secret)) as JwtPayload as JwtPayload &
    User
  return user.id
}

export async function useUser(id?: number): Promise<User> {
  id = id || (await useUid())
  return await findUser(id)
}

export const logout = Api(Post('/api/user/logout'), async () => {
  const ctx = useContext<Context>()
  const {
    jwt: { secret },
  } = useConfig()
  const token = ctx.cookies.get('token') || ctx.get('token')
  if (token) {
    ;(async () => {
      const jwt = await useInject(JwtService)
      const payload = (await jwt.verify(token, secret)) as JwtPayload
      const redis = await useInject(RedisService)
      redis.del(getTokenKey(payload.id))
    })()
  }
  ctx.cookies.set('token', null)
  return success()
})

export const create = Api(Post('/api/user/create'), async () => {
  const ctx = useContext<Context>()
  const { username, password } = ctx.request.body
  const u = await prisma.user.count({
    where: {
      username: {
        equals: username,
      },
    },
  })
  if (u) {
    return error(`${username} is exists!`)
  }
  const user = await prisma.user.create({
    data: {
      username,
      password: generatePassword(password),
      gender: Gender.Male,
    },
  })
  return success(pureUser(user))
})
