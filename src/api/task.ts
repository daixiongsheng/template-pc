import { Api, Get } from '@midwayjs/hooks'
import { success } from './utils/response'

export const getTask = Api(Get('/api/task/get'), async () => {
  return success()
})
