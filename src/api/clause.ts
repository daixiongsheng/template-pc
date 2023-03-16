import { dbr, dbw } from './prisma'
import { Api, Get, Post } from '@midwayjs/hooks'
import { success, successPage } from './utils/response'
import { Clause, Prisma } from '@prisma/client'

export const getClauseById = Api(
  Get('/api/clause/get'),
  async (id: string | number) => {
    const clause = await dbr.clause.findFirst({
      where: {
        id: +id,
      },
      select: {
        id: true,
        part: true,
        chapter: true,
        item: true,
        content: true,
      },
    })
    return success(clause)
  }
)

export const getClauses = Api(Get('/api/clause/get_list'), async () => {
  const clause = await dbr.$queryRaw<
    ({ statute_id: number; title: string } & Clause)[]
  >`
      select
        clause.id,
        statute_id,
        statute.title,
        part,
        chapter,
        item,
        content
      from
        clause
        left join statute on clause.statute_id = statute.id
    `
  return success(clause)
})

export const findClause = Api(
  Post('/api/clause/find'),
  async (content: string) => {
    const clause = await dbr.$queryRaw<
      ({ statute_id: number; title: string } & Clause)[]
    >`
    select
      clause.id,
      statute_id,
      statute.title,
      part,
      chapter,
      item,
      content
    from
      clause
      left join statute on clause.statute_id = statute.id
    where content like ${'%' + content + '%'}
    `
    return success(clause)
  }
)

export const createClause = Api(
  Post('/api/clause/create'),
  async ({
    content,
    chapter,
    part,
    item,
    statuteId,
  }: Pick<Clause, 'chapter' | 'content' | 'item' | 'part'> & {
    statuteId: number
  }) => {
    await dbw.clause.create({
      data: {
        content,
        chapter,
        part,
        item,
        statuteId,
      },
    })
    return success()
  }
)

export const removeClause = Api(
  Post('/api/clause/remove'),
  async (id: string | number) => {
    await dbw.clause.delete({
      where: {
        id: +id,
      },
    })
    return success()
  }
)
