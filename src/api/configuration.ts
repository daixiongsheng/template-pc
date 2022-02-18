import { createConfiguration, hooks, useContext } from '@midwayjs/hooks';
import * as Koa from '@midwayjs/koa';
import * as cache from '@midwayjs/cache';
import * as redis from '@midwayjs/redis';
import cors from '@koa/cors';
import { join } from 'path';
import logger from './middleware/logger';
import error from './middleware/error';
import koaJwt from 'koa-jwt';
import config from './config/config.default';

import * as jwt from '@midwayjs/jwt';
/**
 * setup midway server
 */

export default createConfiguration({
  imports: [
    cache,
    redis,
    Koa,
    jwt,
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
      },
    },
    join(__dirname, 'config'),
  ],
  onReady(container, app): void {
    console.log('onReady');
  },
  onStop(container, app): void {
    console.log('onStop');
  },
  onConfigLoad(container, app): void {
    console.log('onConfigLoad');
  },
  onServerReady(container, app): void {
    console.log('onServerReady');
  },
});
