import { PrismaClient } from '@prisma/client'
import { format } from 'sql-formatter'
import { highlight } from 'sql-highlight'
import colors from 'colors'

const db = {
  leader: {
    URL: 'mysql://root:123456@mysql100:3306/national_legal',
  },
  follower: {
    URL: 'mysql://root:123456@mysql100:3306/national_legal',
  },
}

export const prisma = new PrismaClient({
  log: [{ level: 'query', emit: 'event' }],
})

export const dbr = new PrismaClient({
  datasources: {
    db: {
      url: db.follower.URL,
    },
  },
  log: [{ level: 'query', emit: 'event' }],
})

export const dbw = new PrismaClient({
  datasources: {
    db: {
      url: db.leader.URL,
    },
  },
  log: [{ level: 'query', emit: 'event' }],
})

prisma.$use((params, next) => {
  return next(params)
})
;[dbw, dbr, prisma].forEach((con) =>
  con.$on('query', (e) => {
    let params: string[] = []
    try {
      params = JSON.parse(e.params)
    } catch {
      params = [e.params]
    }
    console.log(
      colors.blue(
        colors.bgYellow('=============== Query Begin ===============')
      )
    )
    console.log(highlight(format(e.query, { params })))
    console.log(
      colors.blue(colors.bgYellow('=============== Query End ==============='))
    )
  })
)
