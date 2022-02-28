import { Provide, Task, FORMAT, Inject } from '@midwayjs/decorator'
import Consul from 'consul'
import { ConfigService } from '../services/config'

@Provide()
export class ConfigTask {
  @Inject('consul:consul')
  consul: Consul.Consul

  @Inject()
  configService: ConfigService

  @Task({
    repeat: { cron: FORMAT.CRONTAB.EVERY_MINUTE },
    removeOnComplete: true,
  })
  syncConfig(): void {
    this.configService.sync()
  }
}
