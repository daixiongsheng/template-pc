import { QueueService } from '@midwayjs/task'
import { Api, Get, useInject } from '@midwayjs/hooks'
import { DemoQueue } from './task/demoQueue'
import { success } from './utils/response'
import { UserService } from './services/user'
import { RabbitmqService } from './mq/producer/rabbitmq'

export const getTask = Api(Get('/api/task/get'), async () => {
  // const qs = await useInject(QueueService)
  // const us = await useInject(UserService)
  const rabbitmqService = await useInject(RabbitmqService)
  // rabbitmqService.publicMessageIndivaidually()
  // rabbitmqService.publicMessageAckAll()
  // rabbitmqService.publicMessageAckAsync()
  // const queue = await qs.getClassQueue(DemoQueue)
  // const task = await qs.getQueueTask('HelloTask', 'test')
  // console.log(queue.base64Name(), await task.count())

  // const s = await us.invoke()

  return success()
})
