import { MidwayConfig } from '@midwayjs/core'
import {
  Provide,
  Scope,
  ScopeEnum,
  Init,
  Autoload,
  Destroy,
  App,
  Config,
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

  @Config()
  config: MidwayConfig
  @Config('redisConfig')
  redisConfig
  @Init()
  connect(): void {
    const url = this.app.getConfig('rabbitMQServer.url')
    console.log(this.config, 'sssredisConfig', this.redisConfig, 'config')
    return
    this.connection = amqp.connect(url)

    // 创建 channel
    this.channelWrapper = this.connection.createChannel({
      json: true,
      setup(channel: amqp.Channel) {
        Promise.all([
          // 绑定队列
          channel.assertQueue('log', {
            durable: false,
            exclusive: false,
            autoDelete: true,
          }),
          channel.assertExchange('midway', 'fanout', {
            durable: false,
            autoDelete: true,
          }),
        ])
      },
    })

    this.channelWrapper.bindQueue('log', '', '')
  }

  async publish(): Promise<void> {
    // this.channelWrapper.publish('midway', '', random().toString())
  }

  @Destroy()
  async close(): Promise<void> {
    await this.channelWrapper.close()
    await this.connection.close()
  }
}
