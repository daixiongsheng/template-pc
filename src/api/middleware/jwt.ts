import { Middleware } from '@midwayjs/decorator'
import { PassportMiddleware } from '@midwayjs/passport'
import { JwtStrategy } from '../strategy/jwt.strategy'
import { AuthenticateOptions } from 'passport'
import { Context } from '@midwayjs/koa'
import { parse } from 'url'

const unlessPath: (string | RegExp)[] = [
  /\/api\/banner/,
  /\/public/,
  '/api/user/login',
]

@Middleware()
export class JwtPassportMiddleware extends PassportMiddleware(JwtStrategy) {
  getAuthenticateOptions(): Promise<AuthenticateOptions> | AuthenticateOptions {
    return {}
  }

  ignore(ctx: Context): boolean {
    const requestedUrl = parse(ctx.originalUrl || ctx.url, true)
    return unlessPath.some(function (p) {
      return (
        (typeof p === 'string' && p === requestedUrl.pathname) ||
        (p instanceof RegExp && !!p.exec(requestedUrl.pathname))
      )
    })
  }
}
