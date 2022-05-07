import { dbr, dbw } from './prisma'
import { Api, Get, Post } from '@midwayjs/hooks'
import { success, successPage } from './utils/response'

export const getStatuteById = Api(
  Get('/api/statute/get'),
  async (id: string | number) => {
    const statue = await dbr.statute.findFirst({
      where: {
        id: +id,
      },
      select: {
        id: true,
        title: true,
      },
    })
    return success(statue)
  }
)

export const getStatutes = Api(
  Get('/api/statute/get_list'),
  async (page = 1, size = 10) => {
    const total = await dbr.statute.count()
    const statue = await dbr.statute.findMany({
      select: {
        id: true,
        title: true,
      },
      skip: (page - 1) * size,
    })
    return successPage(statue, size, page, total)
  }
)

export const getAllStatutes = Api(Get('/api/statute/get_all'), async () => {
  const statues = await dbr.statute.findMany({
    select: {
      id: true,
      title: true,
    },
  })
  return success(statues)
})

export const getStatuteDetail = Api(
  Get('/api/statute/get_detail'),
  async (id: string | number) => {
    const statue = await dbr.statute.findFirst({
      where: {
        id: +id,
      },
    })
    const clause = await dbr.clause.findMany({
      where: {
        statuteId: +id,
      },
      orderBy: {
        part: 'asc',
        chapter: 'asc',
        item: 'asc',
      },
    })
    return success({ statue, clause })
  }
)

export const findStatute = Api(
  Get('/api/statute/find'),
  async (title: string, page = 1, size = 10) => {
    const total = await dbr.statute.count({
      where: {
        title: {
          contains: title,
        },
      },
    })
    const statue = await dbr.statute.findMany({
      where: {
        title: {
          contains: title,
        },
      },
      select: {
        id: true,
        title: true,
      },
      skip: (page - 1) * size,
    })
    return successPage(statue, size, page, total)
  }
)

export const createStatute = Api(
  Post('/api/statute/create'),
  async (title: string) => {
    await dbw.statute.create({
      data: {
        title,
      },
    })
    return success()
  }
)

export const removeStatute = Api(
  Post('/api/statute/remove'),
  async (id: string | number) => {
    await dbw.statute.delete({
      where: {
        id: +id,
      },
    })
    return success()
  }
)
