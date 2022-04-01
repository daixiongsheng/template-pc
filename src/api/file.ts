import { join, dirname } from 'path'
import { Context } from '@midwayjs/koa'
import { Api, Post, useConfig, useContext } from '@midwayjs/hooks'
import { success } from './utils/response'
import { createWriteStream, existsSync, mkdirSync } from 'fs'
import { Readable } from 'stream'

export const saveFile = (stream: Readable, path: string): void => {
  const dir = dirname(path)
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
  const out = createWriteStream(path)
  stream.pipe(out)
}

export const upload = Api(Post('/api/file/upload'), async () => {
  const ctx = useContext<Context>()
  const outdir = useConfig('uploadOutDir')
  for (const { filename, data } of ctx.files) {
    const p = join(outdir, filename)
    saveFile(data as Readable, p)
  }
  return success()
})
