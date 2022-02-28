import {
  Consumer,
  MSListenerType,
  RabbitMQListener,
  Inject,
  App,
} from '@midwayjs/decorator'
import { Context, Application } from '@midwayjs/rabbitmq'
import { ConsumeMessage } from 'amqplib'

@Consumer(MSListenerType.RABBITMQ)
export class LogConsumer {
  @App()
  app: Application

  @Inject()
  ctx: Context

  @Inject()
  logger

  @RabbitMQListener('midway', {
    exchange: 'logs',
    exchangeOptions: {
      type: 'fanout',
      durable: false,
    },
    exclusive: false,
    consumeOptions: {
      noAck: true,
    },
  })
  async gotData(msg: ConsumeMessage): Promise<void> {
    console.log('listen logs.midway1 =====', msg.content.toString('utf-8'))
  }

  @RabbitMQListener('midway', {
    exchange: 'logs',
    exchangeOptions: {
      type: 'fanout',
      durable: false,
    },
    exclusive: false,
    consumeOptions: {
      noAck: true,
    },
  })
  async gotData2(msg: ConsumeMessage): Promise<void> {
    console.log('listen logs.midway2 =====', msg.content.toString('utf-8'))
  }
}
