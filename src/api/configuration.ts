import { createConfiguration, hooks } from '@midwayjs/hooks'
import { HooksMiddleware } from '@midwayjs/hooks-core'

import * as Koa from '@midwayjs/koa'
import * as cache from '@midwayjs/cache'
import * as redis from '@midwayjs/redis'
import * as swagger from '@midwayjs/swagger'
import * as jwt from '@midwayjs/jwt'
import * as task from '@midwayjs/task'
import * as passport from '@midwayjs/passport'
import * as upload from '@midwayjs/upload'
import * as socketio from '@midwayjs/socketio'
import * as crossDomain from '@midwayjs/cross-domain'
import * as grpc from '@midwayjs/grpc'
import * as consul from '@midwayjs/consul'
import * as rabbitmq from '@midwayjs/rabbitmq'
import * as prometheus from '@midwayjs/prometheus'

import { instrument } from '@socket.io/admin-ui'

import { join } from 'path'

import logger from './middleware/logger'
import error from './middleware/error'
import { JwtPassportMiddleware } from './middleware/jwt'

/**
 * setup midway server
 */

export default createConfiguration({
  imports: [
    Koa,
    cache,
    redis,
    jwt,
    passport,
    upload,
    socketio,
    // swagger,
    crossDomain,
    task,
    grpc,
    consul,
    rabbitmq,
    prometheus,
    // {
    //   component: swagger,
    //   enabledEnvironment: ['local'],
    // },
    hooks({
      middleware: [
        logger,
        error,
        JwtPassportMiddleware as any as HooksMiddleware,
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
    const sf = await container.getAsync(socketio.Framework)
    // const sio = mfs.getFramework('socketIO')
    instrument(sf.app, {
      auth: false,
      namespaceName: '/admin',
    })
  },
  /* eslint-enable @typescript-eslint/no-unused-vars */
})
