import { useContext } from '@midwayjs/hooks'
import { HooksMiddleware } from '@midwayjs/hooks-core'
import { Context } from '@midwayjs/koa'
import { error } from '../utils/response'

const errorMiddleware: HooksMiddleware = async (next) => {
  await next().catch((err) => {
    console.error(err.message)
    const ctx = useContext<Context>()
    let msg = '服务器错误'
    let code = -1
    if (ctx.status === 401 || err.message?.includes('Authentication Error')) {
      code = 401
      msg = '登录信息已失效，请重新登录'
    }
    if (ctx.status === 404) {
      code = 404
      msg = 'Not Found'
    } else {
      code = ctx.status
    }
    ctx.status = 200
    ctx.body = error(msg, code)
  })
}

export default errorMiddleware
