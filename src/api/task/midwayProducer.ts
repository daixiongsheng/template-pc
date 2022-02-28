import { RabbitmqService } from './../mq/producer/rabbitmq'
import { join } from 'path'
import { message } from 'antd'
import { HttpClient } from '@midwayjs/core'
import { Provide, Task, FORMAT, Inject, App } from '@midwayjs/decorator'
import { Clients, createGRPCConsumer } from '@midwayjs/grpc'
import { helloworld } from '../rpc/domain/helloworld'
import { UserService } from '../services/user'
import { random } from '../utils'
import { BalancerService } from '@midwayjs/consul'
import Consul from 'consul'
import { Application } from '@midwayjs/koa'

@Provide()
export class MidwayTask {
  @Inject()
  rabbitmqService: RabbitmqService

  // 例如下面是每分钟执行一次，并且是分布式任务
  @Task({
    repeat: { cron: FORMAT.CRONTAB.EVERY_PER_5_SECOND },
    removeOnComplete: true,
  })
  async publish(): Promise<void> {
    this.rabbitmqService.publish()
  }
}
