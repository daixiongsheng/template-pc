import { QueueService } from '@midwayjs/task'
import { Api, Get, useInject } from '@midwayjs/hooks'
import { DemoQueue } from './task/demoQueue'
import { success } from './utils/response'

export const getTask = Api(Get('/api/task/get'), async () => {
  const qs = await useInject(QueueService)
  const queue = await qs.getClassQueue(DemoQueue)
  const task = await qs.getQueueTask('HelloTask', 'test')
  console.log(queue.base64Name(), await task.count())
  return success()
})
