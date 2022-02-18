import { Context } from '@midwayjs/rpc';

export const handleRequest = async (ctx: Context, next: () => Promise<any>) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    ctx.req.headers.token = token;
  }
  await next();
};

export const handleResponse = async (
  ctx: Context,
  next: () => Promise<any>,
) => {
  await next();
  if (ctx.req.url.includes('login')) {
    const token = ctx.res.token;
    if (token) {
      localStorage.setItem('access_token', token);
    }
  }
  if (ctx.res.code !== 0) {
    throw ctx.res.msg;
  } else {
    ctx.res = ctx.res.data;
  }
};
