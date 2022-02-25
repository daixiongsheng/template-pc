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
  const dir = join(appInfo.appDir, 'src', 'api', 'rpc', 'proto')

  const pkgs = readdirSync(dir)

  const services = pkgs.map((pkg) => ({
    protoPath: join(dir, pkg),
    package: basename(pkg, '.proto'),
  }))
  return {
    koa: {
      // 在hooks有问题
      globalPrefix: '',
      // http2: true,
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
      tokenKey: 'token',
      expiresIn: maxAge / 1000,
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
      // mode: UploadMode, 默认为file，即上传到服务器临时目录，可以配置为 stream
      // mode: 'file',
      mode: 'stream',
      fileSize: '10mb',
      tmpdir: join(tmpdir(), 'midway-upload-files'),
      // cleanTimeout: number，上传的文件在临时目录中多久之后自动删除，默认为 5 分钟
      cleanTimeout: 5 * 60 * 1000,
    },
    uplodaOutDir: join(process.cwd(), 'uplodas'),
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
    grpcServer: {
      services,
    },
    grpc: {
      services: [
        {
          url: 'localhost:3000',
          protoPath: join(
            appInfo.appDir,
            'src',
            'api',
            'rpc',
            'proto',
            'helloworld.proto'
          ),
          package: 'helloworld',
        },
      ],
    },
    passport: {
      session: false,
    },
  }
}
