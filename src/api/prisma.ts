import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

prisma.$use((params, next) => {
  // console.log(params);
  return next(params);
});
