import { createConfiguration, hooks } from '@midwayjs/hooks'

import * as Koa from '@midwayjs/koa'
import * as cache from '@midwayjs/cache'
import * as redis from '@midwayjs/redis'
import * as jwt from '@midwayjs/jwt'
import * as task from '@midwayjs/task'
import * as passport from '@midwayjs/passport'
import * as upload from '@midwayjs/upload'
import * as crossDomain from '@midwayjs/cross-domain'

import { join } from 'path'

import logger from './middleware/logger'
import error from './middleware/error'
import { JwtPassportMiddleware } from './middleware/jwt'

export default createConfiguration({
  imports: [
    Koa,
    cache,
    redis,
    jwt,
    passport,
    upload,
    crossDomain,
    task,
    hooks({
      middleware: [logger, error],
    }),
  ],
  importConfigs: [join(__dirname, 'config')],
  /* eslint-disable @typescript-eslint/no-unused-vars */
  onReady(container, app): void {
    app.getLogger().info('onReady')
    app.useMiddleware(JwtPassportMiddleware)
  },
  onStop(container, app): void {
    app.getLogger().info('onStop')
  },
  async onConfigLoad(container, app): Promise<void> {
    app.getLogger().info('onConfigLoad')
  },
  async onServerReady(container, app): Promise<void> {
    app.getLogger().info('onServerReady')
  },
  /* eslint-enable @typescript-eslint/no-unused-vars */
})
