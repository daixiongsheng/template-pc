import { Middleware } from '@midwayjs/rpc'

export const handleRequest: Middleware = async (ctx, next) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    ctx.req.headers.token = token
  }
  await next()
}

export const handleResponse: Middleware = async (ctx, next) => {
  await next()
  if (ctx.req.url.includes('login')) {
    const token = ctx.res.token
    if (token) {
      localStorage.setItem('access_token', token)
    }
  }
  if (ctx.res.code !== 0) {
    throw ctx.res.msg
  } else {
    ctx.res = ctx.res.data
  }
}
