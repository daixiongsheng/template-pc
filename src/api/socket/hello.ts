import {
  WSController,
  Provide,
  OnWSConnection,
  Inject,
  OnWSMessage,
  WSEmit,
  OnWSDisConnection,
} from '@midwayjs/decorator'
import { Context } from '@midwayjs/socketio'

@Provide()
@WSController('/')
export class HelloSocketController {
  @Inject()
  ctx: Context

  @OnWSConnection()
  init(): void {
    console.log(`namespace / got a connection ${this.ctx.id}`)
  }

  @OnWSMessage('myEvent')
  @WSEmit('myEventResult')
  async gotMyMessage(payload: any): Promise<{ name: string }> {
    console.log(payload)
    return { name: 'harry' }
  }

  @OnWSDisConnection()
  disconnect(reason: string): void {
    console.log(this.ctx.id + ' disconnect ' + reason)
  }
}
