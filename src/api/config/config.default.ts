import { MidwayConfig } from '@midwayjs/core'
import { uploadWhiteList } from '@midwayjs/upload'
import * as redisStore from 'cache-manager-ioredis'
import { join } from 'path'
import { tmpdir } from 'os'
// 7天
const maxAge = 7 * 24 * 3600 * 1000
const config: MidwayConfig = {
  koa: {
    // 在hooks有问题
    globalPrefix: '',
  },
  keys: 'midway-template-pc',
  cache: {
    store: redisStore,
    options: {
      host: 'redis100',
      port: 6379,
      password: '',
      db: 1,
      keyPrefix: 'cache:',
      ttl: 100,
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
      db: 2,
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

    // whitelist: uploadWhiteList.filter((ext) => ext !== '.pdf'),
    // tmpdir: string，上传的文件临时存储路径
    tmpdir: join(tmpdir(), 'midway-upload-files'),
    // cleanTimeout: number，上传的文件在临时目录中多久之后自动删除，默认为 5 分钟
    cleanTimeout: 5 * 60 * 1000,
  },
  uplodaOutDir: join(process.cwd(), 'uplodas'),
}

export default config
