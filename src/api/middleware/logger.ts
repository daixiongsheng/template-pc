import { Context } from '@midwayjs/koa'
import { useContext } from '@midwayjs/hooks'
import colors from 'colors'
const logger = async (next: any) => {
  const ctx = useContext<Context>()
  const { body = {} } = ctx.request
  const hasData = Object.keys(body).length > 0
  console.log(
    `${colors.yellow('<-----')} [${ctx.method}] ${ctx.url} ${
      hasData ? JSON.stringify(ctx.request.body) : ''
    }`
  )

  const start = Date.now()
  await next()
  const cost = Date.now() - start

  console.log(
    `${colors.yellow('----->')} [${ctx.method}] ${ctx.url} ${
      ctx.status
    } ${cost}ms`
  )
}

export default logger
