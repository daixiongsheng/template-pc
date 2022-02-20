import { Provide, Inject, Task, Init, Queue } from '@midwayjs/decorator'
import { Api, Post, useContext, useInject } from '@midwayjs/hooks'
import { Context } from '@midwayjs/koa'
import { QueueService } from '@midwayjs/task'
import { success } from './utils/response'

@Provide()
export class UserService {
  // 例如下面是每分钟执行一次，并且是分布式任务
  @Task({
    repeat: { cron: '* * * * *' },
  })
  async test(): Promise<void> {
    console.log('this.helloService.getName()')
  }
}

@Queue()
@Provide()
export class TestJob {
  @Inject()
  userService: UserService

  async execute(params: any, job): Promise<void> {
    console.log(params, '---------')
  }

  async sleep(delay): Promise<unknown> {
    console.log('sleep', delay)
    return await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
      }, delay)
    })
  }
}

export const addTask = Api(Post('/api/task/create'), async () => {
  const ctx = useContext<Context>()
  const qs = await useInject(QueueService)
  const a = new TestJob()
  const q2s = await qs.getClassQueue(TestJob)

  // 3秒后触发分布式任务调度。
  // console.log(qs.getClassQueue(HelloTask))
  // const xxx = await qs
  //   .execute(HelloTask, { params: 'sssssss' }, { delay: 1000 })
  //   .catch(console.error)
  return success()
})
