import { HttpClient } from '@midwayjs/core'
import { Provide, Task, FORMAT } from '@midwayjs/decorator'

const client = new HttpClient()

@Provide()
export class HelloTask {
  // 例如下面是每分钟执行一次，并且是分布式任务
  @Task({
    repeat: { cron: FORMAT.CRONTAB.EVERY_PER_5_SECOND },
    removeOnComplete: true,
  })
  async test(): Promise<void> {
    {
      // const result = await client.request(
      //   'http://127.0.0.1:3000/api/banner/get_by_type/1',
      //   {
      //     method: 'GET',
      //     dataType: 'json',
      //     contentType: 'json',
      //     // headers: {
      //     //   token:
      //     //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQ1NTQ4OTY4LCJleHAiOjE2NDYxNTM3Njh9.LNIxX4Dz15EOh39uzQP3ao4bAF5a3TSazcCOTXHi6KE',
      //     // },
      //   }
      // )
      // console.log(result.data)
    }
    console.log('test', Date.now())
  }
}
