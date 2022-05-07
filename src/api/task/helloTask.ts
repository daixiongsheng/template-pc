import { Provide, Task, FORMAT } from '@midwayjs/decorator'
import { random } from '../utils'

@Provide()
export class HelloTask {
  // 例如下面是每分钟执行一次，并且是分布式任务
  @Task({
    repeat: { cron: FORMAT.CRONTAB.EVERY_PER_5_SECOND },
    removeOnComplete: true,
  })
  async test(): Promise<void> {
    console.log('test', random())
  }
}
