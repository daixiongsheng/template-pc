import { Context } from '@midwayjs/koa';
import { MidwayConfig } from '@midwayjs/core';
import jwt from 'koa-jwt';
const maxAge = 7 * 24 * 3600;
const config: MidwayConfig & { jwt: jwt.Options & { maxAge: number } } = {
  cache: {
    store: 'memory',
    options: {
      max: 100,
      ttl: 10,
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
    maxAge,
    getToken(ctx: Context) {
      return ctx.cookies.get('token') || ctx.get('token');
    },
  },
  cookies: {
    httpOnly: true,
    path: '/',
    maxAge,
  },
};

export default config;
