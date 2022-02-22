// src/strategy/jwt.strategy.ts

import { Config } from '@midwayjs/decorator'
import { CustomStrategy, PassportStrategy } from '@midwayjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'

export type TokenPayload = {
  id: number
  iat: number
  exp: number
  // iss: jwt签发者
  // sub: jwt所面向的用户
  // aud: 接收jwt的一方
  // exp: jwt的过期时间，这个过期时间必须要大于签发时间
  // nbf: 定义在什么时间之前，该jwt都是不可用的.
  // iat: jwt的签发时间
  // jti: jwt的唯一身份标识，主要用来作为一次性token,从而回避重放攻击。
}

@CustomStrategy()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  @Config('jwt')
  jwtConfig

  async validate(payload: TokenPayload): Promise<any> {
    return payload
  }

  getStrategyOptions(): any {
    return {
      secretOrKey: this.jwtConfig.secret,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (ctx) => {
          return ctx.cookies.get('token') || ctx.get('token')
        },
      ]),
    }
  }
}
