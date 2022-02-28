import {
  Provide,
  Scope,
  ScopeEnum,
  Init,
  Autoload,
  Destroy,
  App,
} from '@midwayjs/decorator'
import { Application } from '@midwayjs/koa'
import * as amqp from 'amqp-connection-manager'
import { random } from '../../utils'
@Autoload()
@Provide()
@Scope(ScopeEnum.Singleton) // Singleton 单例，全局唯一（进程级别）
export class RabbitmqService {
  private connection: amqp.AmqpConnectionManager

  private channelWrapper: amqp.ChannelWrapper

  @App()
  app: Application

  @Init()
  connect(): void {
    const url = this.app.getConfig('rabbitMQServer.url')
    this.connection = amqp.connect(url)
    // 创建 channel
    this.channelWrapper = this.connection.createChannel({
      // json: true,
      // setup(channel: amqp.Channel) {
      //   Promise.all([
      //     // 绑定队列
      //     channel.assertQueue('logs', {
      //       durable: false,
      //       exclusive: false,
      //       autoDelete: true,
      //     }),
      //     channel.assertExchange('midway', 'fanout', {
      //       durable: false,
      //       autoDelete: true,
      //     }),
      //   ])
      // },
    })
    // this.channelWrapper.bindQueue('logs', '', '')
  }

  async publish(): Promise<void> {
    const m = random().toString()
    console.log('publish msg:', m)
    this.channelWrapper.publish('logs', '', m)
  }

  @Destroy()
  async close(): Promise<void> {
    await this.channelWrapper.close()
    await this.connection.close()
  }
}
