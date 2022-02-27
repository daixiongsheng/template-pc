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

@Autoload()
@Provide()
@Scope(ScopeEnum.Singleton) // Singleton 单例，全局唯一（进程级别）
export class RabbitmqService {
  private connection: amqp.AmqpConnectionManager

  private channelWrapper: amqp.ChannelWrapper
  private consumerChannel: amqp.ChannelWrapper

  @App()
  app: Application

  @Init()
  connect(): void {
    const url = this.app.getConfig('rabbitMQServer.url')
    this.connection = amqp.connect(url)

    // 创建 channel
    this.channelWrapper = this.connection.createChannel({
      json: true,
      setup(channel: amqp.Channel) {
        Promise.all([
          // 绑定队列
          channel.assertQueue('abc', {
            durable: true,
            exclusive: false,
            autoDelete: false,
          }),
        ])
      },
    })

    this.consumerChannel = this.connection.createChannel({
      json: true,
    })
  }

  // 发送消息
  public async sendToQueue(
    queueName: string,
    data: Buffer | string | unknown
  ): Promise<any> {
    return this.channelWrapper.sendToQueue(queueName, data)
  }

  async consumer(queueName: string): Promise<void> {
    // this.channel
    const consume = await this.consumerChannel.consume(queueName, (msg) => {
      console.log(msg.content.toString(), '消费消息')
    })
    console.log('consume', consume)
  }

  @Destroy()
  async close(): Promise<void> {
    await this.channelWrapper.close()
    await this.connection.close()
  }
}
