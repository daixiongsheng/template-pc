import { PrismaClient } from '@prisma/client'
import { format } from 'sql-formatter'
import { highlight } from 'sql-highlight'
import colors from 'colors'
export const prisma = new PrismaClient({
  log: [{ level: 'query', emit: 'event' }],
})

prisma.$use((params, next) => {
  // console.log(params);
  return next(params)
})

prisma.$on('query', (e) => {
  const params = JSON.parse(e.params) as string[]
  console.log(
    colors.blue(colors.bgYellow('=============== Query Begin ==============='))
  )
  console.log(highlight(format(e.query, { params })))
  console.log(
    colors.blue(colors.bgYellow('=============== Query End ==============='))
  )
})
