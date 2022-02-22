import { MidwayConfig } from '@midwayjs/core'
const maxAge = 7 * 24 * 3600 * 1000
const config: MidwayConfig = {
  koa: {
    // 在hooks有问题
    globalPrefix: '',
  },
  keys: 'midway-template-pc',
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
    expiresIn: maxAge / 1000,
    maxAge,
    tz: 'Asia/Shanghai',
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
    prefix: 'midway-template-pc',
    defaultJobOptions: {
      repeat: {
        tz: 'Asia/Shanghai',
      },
    },
  },
}

export default config
