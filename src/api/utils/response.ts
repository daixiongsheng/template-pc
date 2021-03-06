export type Response<T> = {
  code: number
  msg: string
  data: T
}

export function success<T>(data: any = null, msg = 'ok', code = 0): T {
  // as T是因为前端做了一层处理，只取data的部分
  return { data, code, msg } as Response<T> as unknown as T
}

export function error(msg: string, code = -1): Response<null> {
  return success(null, msg, code)
}

export type PageResonse<T> = {
  list: T[]
  size: number
  page: number
  total: number
}

export function successPage<T>(list: T[], size: number, page: number, total: number): PageResonse<T> {
  return success<PageResonse<T>>({
    list,
    size,
    page,
    total,
  })
}
