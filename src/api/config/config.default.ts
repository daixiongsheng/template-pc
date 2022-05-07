import { MidwayAppInfo, MidwayConfig } from '@midwayjs/core'
import * as redisStore from 'cache-manager-ioredis'
import { join } from 'path'
import { tmpdir } from 'os'
import { createRedisAdapter } from '@midwayjs/socketio'
// 7天
const maxAge = 7 * 24 * 3600 * 1000

const RedisDB = {
  cache: 1,
  default: 0,
  task: 2,
  socket: 3,
}
const KEY = 'national_legal_database'

export default (appInfo: MidwayAppInfo): MidwayConfig => {
  return {
    koa: {
      port: 7001,
      globalPrefix: '',
      hostname: '0.0.0.0',
    },
    midwayLogger: {
      default: {
        dir: join(appInfo.appDir, 'logs'),
        maxSize: '10m',
        maxFiles: '7d',
        consoleLevel: 'info',
      },
      clients: {
        coreLogger: {
          consoleLevel: 'all',
        },
        appLogger: {
          level: 'all',
          consoleLevel: 'all',
        },
      },
    },
    keys: KEY,
    cache: {
      store: redisStore,
      options: {
        host: 'redis100',
        port: 6379,
        password: '',
        db: RedisDB.cache,
        keyPrefix: 'cache:',
        ttl: 100,
      },
      ttl: 100,
    },
    redis: {
      client: {
        port: 6379,
        host: 'redis100',
        db: RedisDB.default,
      },
    },
    jwt: {
      secret: 'XF4cUwMrdyuxnzYeoHkA3smhK1A0eQYR',
      expiresIn: maxAge / 1000,
    },
    passport: {
      session: false,
    },
    cookies: {
      httpOnly: false,
      path: '/',
      maxAge,
    },
    task: {
      redis: {
        port: 6379,
        host: 'redis100',
        db: RedisDB.task,
      },
      prefix: KEY,
      defaultJobOptions: {
        repeat: {
          tz: 'Asia/Shanghai',
        },
        removeOnComplete: true,
        removeOnFail: true,
      },
    },
    upload: {
      mode: 'stream',
      fileSize: '10mb',
      tmpdir: join(tmpdir(), KEY),
      cleanTimeout: 5 * 60 * 1000,
    },
    uploadOutDir: join(appInfo.appDir, 'uplodas'),
    socketIO: {
      port: 9001,
      cors: {
        origin: '*',
      },
      adapter: createRedisAdapter({
        host: 'redis100',
        port: 6379,
        db: RedisDB.socket,
      } as any),
    },
    cors: {
      credentials: false,
    },
  }
}
