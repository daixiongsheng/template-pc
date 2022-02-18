import { User as UserDto } from '@prisma/client';

export type User = Pick<
  UserDto,
  'id' | 'gender' | 'mobile' | 'realname' | 'username'
>;
