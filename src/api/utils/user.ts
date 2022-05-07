import { User } from '@prisma/client'
import md5 from 'js-md5'

export function checkUser(
  user: Pick<User, 'password'>,
  password: string
): boolean {
  return generatePassword(password) === user.password
}

export function getTokenKey(id: number | string): string {
  return `user#token#${id}`
}

export function getUserKey(id: number | string): string {
  return `user#${id}`
}

export function generatePassword(password: string): string {
  return md5(password)
}

enum Gender {
  Female,
  Male,
  Unknown,
}

export function normalizeGender(g: number): string {
  return Gender[g]
}

export function pureUser(
  user: User
): Pick<User, 'id' | 'realname' | 'username' | 'mobile'> & { gender: string } {
  const { id, realname, username, gender, mobile } = user
  return {
    id,
    realname,
    username,
    gender: normalizeGender(gender),
    mobile,
  }
}
