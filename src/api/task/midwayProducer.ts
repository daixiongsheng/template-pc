import { RabbitmqService } from './../mq/producer/rabbitmq'
import { Provide, Task, FORMAT, Inject } from '@midwayjs/decorator'
import { random } from '../utils'

@Provide()
export class MidwayTask {
  @Inject()
  rabbitmqService: RabbitmqService

  // 例如下面是每分钟执行一次，并且是分布式任务
  @Task({
    repeat: { cron: FORMAT.CRONTAB.EVERY_SECOND },
    removeOnComplete: true,
  })
  async publish(): Promise<void> {
    console.log('---------publish')
    let n = random(0, 1)
    while (n--) {
      this.rabbitmqService.publish()
    }
  }
}
