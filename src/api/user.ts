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
import { CacheManager } from '@midwayjs/cache'
import { JwtService } from '@midwayjs/jwt'
import { Gender, User } from '@prisma/client'
import { JwtPayload } from 'jsonwebtoken'
import { Context } from '@midwayjs/koa'
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
import { random } from './utils'
import { UserInfo } from '../typings/global'
import { TokenPayload } from './strategy/jwt.strategy'

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
    const jwt = await useInject(JwtService)
    const token = await jwt.sign(info)
    ;(async () => {
      const ttl = useConfig('cookies.maxAge')
      const cache = await useInject(CacheManager)
      cache.set(getTokenKey(user.id), token, { ttl })
    })()
    ctx.cookies.set('token', token)
    return success({ token })
  }
)

async function findUser(id: number | string) {
  const userKey = getUserKey(id)
  const cache = await useInject(CacheManager)
  let user: User
  user = await cache.get<User>(userKey)
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
  const {
    options: { ttl },
  } = useConfig('cache')
  cache.set<User>(userKey, user, { ttl: ttl + random(0, 10) })
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

export const userUser = async (): Promise<User> => {
  const uid = await useUid()
  const user = await findUser(uid)
  return user
}

export const getCurrentUserInfo = Api(
  Get('/api/user/get_current_user_info'),
  async () => {
    return success<UserInfo>(pureUser(await userUser()))
  }
)

export async function useUid(): Promise<number> {
  const ctx = useContext<Context>()
  const token = ctx.cookies.get('token') || ctx.get('token')
  const jwt = await useInject(JwtService)
  const user = (await jwt.verify(token)) as JwtPayload as TokenPayload
  return user.id
}

export const logout = Api(Post('/api/user/logout'), async () => {
  const ctx = useContext<Context>()
  const user = await userUser()
  if (user) {
    ;(async () => {
      const cache = await useInject(CacheManager)
      cache.del(getTokenKey(user.id))
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
