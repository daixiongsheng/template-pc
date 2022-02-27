import {
  Consumer,
  MSListenerType,
  RabbitMQListener,
  Inject,
  App,
} from '@midwayjs/decorator'
import { Application, Context } from '@midwayjs/koa'
import { ConsumeMessage } from 'amqplib'

@Consumer(MSListenerType.RABBITMQ)
export class UserConsumer2 {
  @App()
  app: Application

  @Inject()
  ctx: Context

  @Inject()
  logger

  // @RabbitMQListener('', {
  //   exchange: 'direct_logs',
  //   exchangeOptions: {
  //     type: 'direct',
  //     durable: false,
  //   },
  //   routingKey: 'direct_key',
  //   exclusive: true,
  //   consumeOptions: {
  //     noAck: true,
  //   },
  // })
  // async gotData(msg: ConsumeMessage): Promise<void> {
  //   console.log('msg', msg)
  //   // TODO
  // }
}
