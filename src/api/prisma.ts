import { PrismaClient } from '@prisma/client'
import { format } from 'sql-formatter'
import { highlight } from 'sql-highlight'
import colors from 'colors'

const db = {
  leader: {
    URL: 'mysql://root:123456@mysql100master:3306/test',
  },
  follower: {
    URL: 'mysql://root:123456@mysql100follower:3306/test',
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
  // console.log(params);
  return next(params)
})
;[dbw, dbr, prisma].forEach((con) =>
  con.$on('query', (e) => {
    const params = JSON.parse(e.params) as string[]
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
