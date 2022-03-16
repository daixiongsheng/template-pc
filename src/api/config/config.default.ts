import { MidwayAppInfo, MidwayConfig } from '@midwayjs/core'
import * as redisStore from 'cache-manager-ioredis'
import { join, basename } from 'path'
import { readdirSync } from 'fs'
import { tmpdir } from 'os'
import { createRedisAdapter } from '@midwayjs/socketio'
// 7天
const maxAge = 7 * 24 * 3600 * 1000

const RedisDB = {
  cache: 1,
  default: 0,
  taks: 2,
  socket: 3,
}

export default (appInfo: MidwayAppInfo): MidwayConfig => {
  const dir = join(appInfo.baseDir, 'rpc', 'proto')

  const pkgs = readdirSync(dir)

  const provideServices = pkgs.map((pkg, i) => ({
    url: `localhost:${7800 + i}`,
    protoPath: join(dir, pkg),
    package: basename(pkg, '.proto'),
  }))
  return {
    koa: {
      port: 7001,
      // 在hooks有问题
      globalPrefix: '',
      // hostname: 'all',
      hostname: '0.0.0.0',
      // http2: false,
    },
    midwayLogger: {
      default: {
        dir: join(appInfo.appDir, 'logs'),
        maxSize: '10m',
        maxFiles: '7d',
        consoleLevel: 'all',
        // level: 'all',
      },
      clients: {
        coreLogger: {
          // level: 'all',
          // consoleLevel: 'warn',

          consoleLevel: 'all',
        },
        appLogger: {
          level: 'all',
          // consoleLevel: 'warn',
          consoleLevel: 'all',
          // contextFormat: (info) => {
          //   const ctx = info.ctx
          //   return `${info.timestamp} ${info.LEVEL} ${info.pid} [${
          //     Date.now() - ctx.startTime
          //   }ms ${ctx.method}] ${info.message}`
          // },
        },
      },
    },
    keys: 'midway-template-pc',
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
      httpOnly: true,
      path: '/',
      maxAge,
    },
    task: {
      redis: {
        port: 6379,
        host: 'redis100',
        db: RedisDB.taks,
      },
      prefix: 'midway-template-pc',
      defaultJobOptions: {
        repeat: {
          tz: 'Asia/Shanghai',
        },
      },
    },
    upload: {
      mode: 'stream',
      fileSize: '10mb',
      tmpdir: join(tmpdir(), 'midway-upload-files'),
      cleanTimeout: 5 * 60 * 1000,
    },
    uplodaOutDir: join(appInfo.appDir, 'uplodas'),
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
    // 本地提供的服务
    grpcServer: {
      url: '0.0.0.0:7788',
      services: provideServices,
    },
    // 可以调用的rpc服务
    // grpc: {
    //   services: [
    //     {
    //       url: 'mmmmp.local:7788',
    //       protoPath: join(appInfo.baseDir, 'rpc/proto/helloworld.proto'),
    //       package: 'helloworld',
    //     },
    //   ],
    // },
    consul: {
      provider: {
        // 注册本服务
        register: true,
        // 应用正常下线反注册
        deregister: true,
        // consul server 主机
        // host: 'consul', // 此处修改 consul server 的地址
        host: 'consul100', // 此处修改 consul server 的地址
        // consul server 端口
        port: '8500', // 端口也需要进行修改
        strategy: 'random',
      },
      service: {
        address: 'mac', // 此处是当前这个 midway 应用的地址
        port: 7788, // midway应用的端口
        tags: ['tag1', 'tag2'], // 做泳道隔离等使用
        name: 'midway-template-pc',
        // others consul service definition
      },
    },
    rabbitmq: {
      url: 'amqp://rabbitmq100:5672',
    },
    prometheus: {
      labels: {
        APP_NAME: 'demo_project',
      },
    },
    rabbitMQServer: {
      url: 'amqp://rabbitmq100:5672',
    },
  }
}
