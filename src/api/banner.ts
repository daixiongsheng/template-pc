import { Api, Get, Params, Query, useContext } from '@midwayjs/hooks'
import { Context } from '@midwayjs/koa'
import { prisma } from './prisma'
import { error, success, successPage } from './utils/response'

export const getBannerByType = Api(
  Get('/api/banner/get_by_type/:type'),
  Query<{ page: string; size: string }>(),
  Params<{ type: string }>(),
  async () => {
    const ctx = useContext<Context>()
    const { page = 1, size = 10 } = ctx.query
    const { type } = ctx.params
    const total = await prisma.banner.count()
    const book = await prisma.banner.findMany({
      select: { type },
    })
    return successPage(book, +size, +page, total)
  }
)

export const getBannerById = Api(
  Get('/api/banner/get_by_id/:id'),
  Params<{ id: string }>(),
  async () => {
    const ctx = useContext<Context>()
    const { id } = ctx.params
    const banner = await prisma.banner.findFirst(id)
    if (!banner) {
      return error('Not Found')
    }
    return success(banner)
  }
)

export const getBannerPage = Api(
  Get('/api/banner/get/list'),
  Query<{ page: string; size: string }>(),
  async () => {
    const ctx = useContext<Context>()
    const { page = 1, size = 10 } = ctx.query
    const total = await prisma.banner.count()
    const book = await prisma.banner.findMany({
      skip: (+page - 1) * +size,
    })
    return successPage(book, +size, +page, total)
  }
)
