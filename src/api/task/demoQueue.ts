import { Queue, Provide } from '@midwayjs/decorator'

@Queue()
@Provide()
export class DemoQueue {
  async execute(params: any): Promise<void> {
    console.log('execute', params)
  }
}
