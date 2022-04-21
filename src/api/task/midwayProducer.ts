import { RabbitmqService } from './../mq/producer/rabbitmq'
import { Provide, Task, FORMAT, Inject } from '@midwayjs/decorator'
import { random, sleep } from '../utils'

@Provide()
export class MidwayTask {
  @Inject()
  rabbitmqService: RabbitmqService

  // // 例如下面是每分钟执行一次，并且是分布式任务
  // @Task({
  //   repeat: { cron: FORMAT.CRONTAB.EVERY_PER_5_SECOND },
  //   removeOnComplete: true,
  // })
  // async publish(): Promise<void> {
  //   // await sleep(3000)
  //   this.rabbitmqService.publish()
  // }
}
