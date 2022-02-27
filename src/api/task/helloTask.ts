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

const client = new HttpClient()

@Provide()
export class HelloTask {
  @App()
  app: Application

  @Inject()
  userService: UserService

  @Inject()
  grpcClients: Clients

  @Inject()
  balancerService: BalancerService

  @Inject('consul:consul')
  consul: Consul.Consul

  @Inject()
  rabbitmqService: RabbitmqService
  consumer: any

  // 例如下面是每分钟执行一次，并且是分布式任务
  @Task({
    repeat: { cron: FORMAT.CRONTAB.EVERY_PER_5_SECOND },
    removeOnComplete: true,
  })
  async test(): Promise<void> {
    console.log('test', random())
    // this.invoke()
    // this.home()
    // this.config()
    // this.vite()
    this.mq()
    this.consu()
  }

  consu(): void {
    this.rabbitmqService.consumer('abc')
  }

  mq(): void {
    this.rabbitmqService.sendToQueue('abc', { hello: 'world' })
  }

  async initConsumer(): Promise<void> {
    if (!this.consumer) {
      const service = await this.balancerService
        .getServiceBalancer()
        .select('midway-template-pc')
      // output
      const { ServicePort, ServiceAddress } = service
      console.log(ServicePort, ServiceAddress)
      console.log(this.app.getAppDir())
      // this.consumer =
      const s = (await createGRPCConsumer({
        url: `${ServiceAddress}:${ServicePort}`,
        protoPath: join(
          this.app.getBaseDir(),
          'rpc',
          'proto',
          'helloworld.proto'
        ),
        package: 'helloworld',
      })) as helloworld.GreeterClient
      s.sayHello().sendMessage({ name: 'from consul' })
    }
  }

  async vite(): Promise<void> {
    this.initConsumer()
  }

  async config(): Promise<void> {
    await this.consul.kv.set('name', JSON.stringify({ name: 'hello' }))
  }

  async http(): Promise<void> {
    const result = await client.request(
      'http://127.0.0.1:3000/api/banner/get_by_type/1',
      {
        method: 'GET',
        dataType: 'json',
        contentType: 'json',
        // headers: {
        //   token:
        //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQ1NTQ4OTY4LCJleHAiOjE2NDYxNTM3Njh9.LNIxX4Dz15EOh39uzQP3ao4bAF5a3TSazcCOTXHi6KE',
        // },
      }
    )
    console.log(result.data)
  }

  async home(): Promise<void> {
    const service = await this.balancerService
      .getServiceBalancer()
      .select('midway-template-pc')
    // output
    console.log(service)
    // ...
  }

  async invoke(): Promise<any> {
    // 获取服务
    // 获取服务
    const greeterService =
      this.grpcClients.getService<helloworld.GreeterClient>(
        'helloworld.Greeter'
      )

    // 调用服务
    const result = await greeterService
      .sayHello()
      .sendMessage({
        name: 'harry',
      })
      .catch((e) => {
        console.error(e.message)
      })
    console.log(result)
    // 返回结果
    // this.userService.invoke()
  }
}
