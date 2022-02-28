import {
  Consumer,
  MSListenerType,
  RabbitMQListener,
  Inject,
  App,
} from '@midwayjs/decorator'
import { Context, Application } from '@midwayjs/rabbitmq'
import { ConsumeMessage } from 'amqplib'
import { sleep } from '../../utils'

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
      noAck: false,
    },
  })
  async gotData(msg: ConsumeMessage): Promise<boolean> {
    // await sleep(100)
    console.log('listen logs.midway1 =====', msg.content.toString('utf-8'))
    return true
  }

  @RabbitMQListener('midway', {
    exchange: 'logs',
    exchangeOptions: {
      type: 'fanout',
      durable: false,
    },
    exclusive: false,
    consumeOptions: {
      noAck: false,
    },
  })
  async gotData2(msg: ConsumeMessage): Promise<boolean> {
    // await sleep(100)
    console.log('listen logs.midway2 =====', msg.content.toString('utf-8'))
    return true
  }
}