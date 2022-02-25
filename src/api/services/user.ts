import { Provide, Inject, Init } from '@midwayjs/decorator'
import { Clients } from '@midwayjs/grpc'
import { helloworld } from '../rpc/domain/helloworld'

@Provide()
export class UserService {
  @Inject()
  grpcClients: Clients

  greeterService: helloworld.GreeterClient

  @Init()
  async init(): Promise<void> {
    // 赋值一个服务实例
    this.greeterService =
      this.grpcClients.getService<helloworld.GreeterClient>(
        'helloworld.Greeter'
      )
    this.greeterService = this.grpcClients.getService<helloworld.GreeterClient>(
      'helloworld.GreeterClient'
    )
  }

  async invoke(): Promise<any> {
    // 调用服务

    const result = await this.greeterService.sayHello().sendMessage({
      name: 'harry',
    })
    console.log(result)
    // 返回结果
    return result
  }
}
