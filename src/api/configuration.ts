import { createConfiguration, hooks } from '@midwayjs/hooks'
import * as Koa from '@midwayjs/koa'
import * as cache from '@midwayjs/cache'
import * as redis from '@midwayjs/redis'
import * as swagger from '@midwayjs/swagger'
import * as jwt from '@midwayjs/jwt'
import * as task from '@midwayjs/task'
import * as passport from '@midwayjs/passport'

import cors from '@koa/cors'
import { join } from 'path'

import logger from './middleware/logger'
import error from './middleware/error'
import { JwtPassportMiddleware } from './middleware/jwt'

/**
 * setup midway server
 */

export default createConfiguration({
  imports: [
    cache,
    redis,
    Koa,
    jwt,
    passport,
    // swagger,
    task,
    // {
    //   component: swagger,
    //   enabledEnvironment: ['local'],
    // },
    hooks({
      middleware: [
        logger,
        error,
        JwtPassportMiddleware,
        cors({ origin: '*', credentials: true, keepHeadersOnError: true }),
      ],
    }),
  ],
  importConfigs: [join(__dirname, 'config')],
  /* eslint-disable @typescript-eslint/no-unused-vars */
  onReady(container, app): void {
    console.log('onReady')
  },
  onStop(container, app): void {
    console.log('onStop')
  },
  onConfigLoad(container, app): void {
    console.log('onConfigLoad')
  },
  onServerReady(container, app): void {
    console.log('onServerReady')
  },
  /* eslint-enable @typescript-eslint/no-unused-vars */
})
