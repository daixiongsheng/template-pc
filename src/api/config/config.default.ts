import { Context } from '@midwayjs/koa'
import { MidwayConfig } from '@midwayjs/core'
import jwt from 'koa-jwt'
const maxAge = 7 * 24 * 3600 * 1000
const config: MidwayConfig & { jwt: jwt.Options & { maxAge: number } } = {
  koa: {
    // 在hooks有问题
    globalPrefix: '',
  },
  cache: {
    store: 'memory',
    options: {
      max: 100,
      ttl: 10,
    },
  },
  redis: {
    client: {
      port: 6379,
      host: 'redis100',
      db: 0,
    },
  },
  jwt: {
    secret: 'XF4cUwMrdyuxnzYeoHkA3smhK1A0eQYR',
    tokenKey: 'token',
    maxAge,
    getToken(ctx: Context) {
      return ctx.cookies.get('token') || ctx.get('token')
    },
  },
  cookies: {
    httpOnly: true,
    path: '/',
    maxAge,
  },
  task: {
    redis: {
      port: 6379,
      host: 'redis100',
    },
    prefix: 'midway-task', // 这些任务存储的key，都是midway-task开头，以便区分用户原有redis里面的配置。
    defaultJobOptions: {
      repeat: {
        tz: 'Asia/Shanghai', // Task等参数里面设置的比如（0 0 0 * * *）本来是为了0点执行，但是由于时区不对，所以国内用户时区设置一下。
      },
    },
  },
}

export default config
