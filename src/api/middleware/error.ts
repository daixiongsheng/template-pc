import { useContext } from '@midwayjs/hooks'
import { HooksMiddleware } from '@midwayjs/hooks-core'
import { Context } from '@midwayjs/koa'
import { error } from '../utils/response'

const errorMiddleware: HooksMiddleware = async (next) => {
  await next().catch((err) => {
    console.error(err.message)
    const ctx = useContext<Context>()
    let msg = '服务器错误'
    switch (err.status) {
      case 401:
        msg = '登录信息已失效，请重新登录'
        break
      case 404:
        msg = 'Not Found'
    }
    ctx.status = 200
    ctx.body = error(msg, err.status)
  })
}

export default errorMiddleware
