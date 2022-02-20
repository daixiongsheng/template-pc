import { createConfiguration, hooks } from '@midwayjs/hooks'
import * as Koa from '@midwayjs/koa'
import * as cache from '@midwayjs/cache'
import * as redis from '@midwayjs/redis'
import * as swagger from '@midwayjs/swagger'
import * as jwt from '@midwayjs/jwt'
import * as task from '@midwayjs/task'

import cors from '@koa/cors'
import koaJwt from 'koa-jwt'

import { join } from 'path'
import logger from './middleware/logger'
import error from './middleware/error'
import config from './config/config.default'
import { HelloService } from './task'

/**
 * setup midway server
 */

export default createConfiguration({
  imports: [
    cache,
    redis,
    Koa,
    jwt,
    swagger,
    task,
    // {
    //   component: swagger,
    //   enabledEnvironment: ['local'],
    // },
    hooks({
      middleware: [
        logger,
        error,
        koaJwt(config.jwt).unless({
          path: [
            '/api/user/login',
            '/api/user/logout',
            /^\/public/,
            // '/api/user/create',
            // '/api/task/create',
          ],
        }),
        cors({ origin: '*', credentials: true, keepHeadersOnError: true }),
      ],
    }),
  ],
  importConfigs: [
    {
      default: {
        keys: 'session_keys',
        midwayLogger: {
          default: {
            level: 'debug',
          },
        },
        coreLogger: {
          level: 'debug',
        },
        logger: {},
      },
    },
    join(__dirname, 'config'),
  ],
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
