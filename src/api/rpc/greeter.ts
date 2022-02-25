// import { MSProviderType, Provider, GrpcMethod } from '@midwayjs/decorator'
// import { helloworld } from './domain/helloworld'

// @Provider(MSProviderType.GRPC, { package: 'helloworld' })
// export class Greeter implements helloworld.Greeter {
//   @GrpcMethod()
//   async sayHello(
//     request: helloworld.HelloRequest
//   ): Promise<{ message: string }> {
//     return { message: 'Hello ' + request.name }
//   }
// }
