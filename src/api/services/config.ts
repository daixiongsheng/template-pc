import { Application } from '@midwayjs/koa'
import {
  Provide,
  Inject,
  Init,
  Scope,
  ScopeEnum,
  App,
} from '@midwayjs/decorator'
import Consul from 'consul'
import _ from 'lodash'

export const config = {}

@Provide()
@Scope(ScopeEnum.Singleton)
export class ConfigService {
  @App()
  app: Application

  protected config = config
  private isSyncing = false
  @Inject('consul:consul')
  consul: Consul.Consul

  @Init()
  async init(): Promise<void> {
    this.sync()
  }

  async get<T>(keyPath: string): Promise<T> {
    const key = keyPath.split('/')
    let value = _.get(this.config, key)
    if (!value) {
      const { Value } = (await this.consul.kv
        .get(keyPath)
        .catch(() => ({}))) as any
      value = Value
    }
    return value
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  set(keyPath: string, value: any): void {
    const key = keyPath.split('/')
    _.set(this.config, key, value)
    this.consul.kv.set(keyPath, value)
  }

  async sync(): Promise<void> {
    if (this.isSyncing) {
      return
    }
    this.isSyncing = true
    const keys = await this.consul.kv.keys<string[]>().catch((e) => {
      return []
    })
    keys.forEach(async (key) => {
      const { Value } = (await this.consul.kv.get(key).catch(() => ({}))) as any
      if (Value) {
        try {
          _.set(this.config, key, JSON.parse(Value))
        } catch (e) {
          this.app
            .getLogger()
            .error(`get config from consul error: ${key} ${e.message}`)
        }
      }
    })
    this.isSyncing = false
  }
}
