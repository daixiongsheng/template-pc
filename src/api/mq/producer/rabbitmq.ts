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
import type * as amqplib from 'amqplib'
@Autoload()
@Provide()
@Scope(ScopeEnum.Singleton) // Singleton 单例，全局唯一（进程级别）
export class RabbitmqService {
  private connection: amqp.AmqpConnectionManager

  private channelWrapper: amqp.ChannelWrapper
  private consumerChannel: amqp.ChannelWrapper
  private MESSAGE_COUNT = 1000

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
      confirm: false,
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
      this.consumerChannel.ack(msg)
    })
    // console.log('consume', consume)
  }

  @Destroy()
  async close(): Promise<void> {
    await this.channelWrapper.close()
    await this.connection.close()
  }

  async publicMessageIndivaidually(): Promise<void> {
    const queueName = 'ndivaidually'
    const ch: amqp.ChannelWrapper = this.connection.createChannel({
      confirm: true,
      setup(ch: amqplib.ConfirmChannel) {
        return ch.assertQueue(queueName, {
          durable: true,
          exclusive: false,
        })
      },
    })
    console.time('批量单个确认')
    console.dir(ch.ack)

    for (let i = 0; i < this.MESSAGE_COUNT; i++) {
      await ch.sendToQueue(
        queueName,
        Buffer.from(JSON.stringify({ message: 'message' + i }))
      )
    }
    console.timeEnd('批量单个确认')
  }

  async publicMessageAckAll(): Promise<void> {
    const queueName = 'ndivaiduallyAll'
    const ch: amqp.ChannelWrapper = this.connection.createChannel({
      confirm: true,
      setup(ch: amqplib.ConfirmChannel) {
        return ch.assertQueue(queueName, {
          durable: true,
          exclusive: false,
        })
      },
    })
    console.time('批量确认')
    console.dir(ch.ack)
    let p = Promise.resolve()
    for (let i = 0; i < this.MESSAGE_COUNT; i++) {
      p = ch.sendToQueue(
        queueName,
        Buffer.from(JSON.stringify({ message: 'message' + i }))
      )
      if (i % 100 === 0) {
        await p
      }
    }
    await p
    console.timeEnd('批量确认')
  }

  async publicMessageAckAsync(): Promise<void> {
    const queueName = 'ndivaiduallyAsync'
    const ch: amqp.ChannelWrapper = this.connection.createChannel({
      confirm: true,
      setup(ch: amqplib.ConfirmChannel) {
        return Promise.all([
          ch.assertQueue(queueName, {
            durable: true,
            exclusive: false,
          }),
          ch.addListener('confirm', (res) => {
            console.log('confirm', res)
          }),
        ])
      },
    })
    console.time('异步确认')
    console.dir(ch.ack)
    let j = 0
    for (let i = 0; i < this.MESSAGE_COUNT; i++) {
      ch.sendToQueue(
        queueName,
        Buffer.from(JSON.stringify({ message: 'message' + i })),
        null,
        (err, result) => {
          if ((j += +result) === this.MESSAGE_COUNT) {
            console.timeEnd('异步确认')
          }
        }
      )
    }
  }
}
