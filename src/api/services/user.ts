import { Provide, Inject } from '@midwayjs/decorator'
import { Clients } from '@midwayjs/grpc'
import { helloworld } from '../rpc/domain/helloworld'

@Provide()
export class UserService {
  @Inject()
  grpcClients: Clients

  async invoke(): Promise<any> {
    // 获取服务
    const greeterService =
      this.grpcClients.getService<helloworld.GreeterClient>(
        'helloworld.Greeter'
      )

    // 调用服务
    const result = await greeterService.sayHello().sendMessage({
      name: 'harry',
    })

    // 返回结果
    return result
  }
}
