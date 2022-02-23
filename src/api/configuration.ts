import { createConfiguration, hooks } from '@midwayjs/hooks'
import { HooksMiddleware } from '@midwayjs/hooks-core'
import { MidwayFrameworkService } from '@midwayjs/core'

import * as Koa from '@midwayjs/koa'
import * as cache from '@midwayjs/cache'
import * as redis from '@midwayjs/redis'
import * as swagger from '@midwayjs/swagger'
import * as jwt from '@midwayjs/jwt'
import * as task from '@midwayjs/task'
import * as passport from '@midwayjs/passport'
import * as upload from '@midwayjs/upload'
// import * as ws from '@midwayjs/ws'
import * as socketio from '@midwayjs/socketio'
import * as crossDomain from '@midwayjs/cross-domain'
import * as grpc from '@midwayjs/grpc'

import { instrument } from '@socket.io/admin-ui'

import cors from '@koa/cors'
import { join } from 'path'

import logger from './middleware/logger'
import error from './middleware/error'
import { JwtPassportMiddleware } from './middleware/jwt'
import { HelloSocketController } from './socket/hello'

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
    upload,
    // ws,
    socketio,
    grpc,
    // swagger,
    crossDomain,
    task,
    // {
    //   component: swagger,
    //   enabledEnvironment: ['local'],
    // },
    hooks({
      middleware: [
        logger,
        error,
        JwtPassportMiddleware as unknown as HooksMiddleware,
        // cors({ origin: '*', credentials: true, keepHeadersOnError: true }),
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
  async onConfigLoad(container, app): Promise<void> {
    console.log('onConfigLoad')
  },
  async onServerReady(container, app): Promise<void> {
    const mfs = await container.getAsync<MidwayFrameworkService>(
      MidwayFrameworkService,
      [container]
    )
    const sio = mfs.getFramework('socketIO')
    instrument(sio.app, {
      auth: false,
      namespaceName: '/admin',
    })
  },
  /* eslint-enable @typescript-eslint/no-unused-vars */
})
