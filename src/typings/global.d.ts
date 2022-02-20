import { User } from '@prisma/client'

export type UserInfo = Pick<
  User,
  'id' | 'gender' | 'mobile' | 'realname' | 'username'
> & {
  authPath: string[]
}
