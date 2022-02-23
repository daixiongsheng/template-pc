import { login } from './../../src/api/user'
import { getApiTrigger, HttpTrigger } from '@midwayjs/hooks'
import { Application, Framework } from '@midwayjs/koa'
import { close, createApp, createHttpRequest } from '@midwayjs/mock'

describe('test koa with api router', () => {
  let app: Application

  beforeAll(async () => {
    app = await createApp()
  })

  afterAll(async () => {
    await close(app)
  })

  it('should GET /', async () => {
    test('Hello World', async () => {
      const trigger = getApiTrigger<HttpTrigger>(login)
      const response = await createHttpRequest(app)
        .get(trigger.path)
        .expect(200)
      expect(response.text).toBe('Hello World!')
    })

    test('Hello World', async () => {
      const response = await createHttpRequest(app).get('/hello').expect(200)
      expect(response.text).toBe('Hello World!')
    })

    // // make request
    // const request = await createHttpRequest(app)
    // const result = await request.post('/api/user/login').send({
    //   username: 'xiaozaoqidezao',
    //   password: '',
    // })

    // expect(result.status).toBe(200)
    // expect(result.body).toBe('Hello Midwayjs!')
  })
})
