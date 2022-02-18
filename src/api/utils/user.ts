import { Gender, User } from '@prisma/client';
import md5 from 'js-md5';

export function checkUser(
  user: Pick<User, 'password'>,
  password: string,
): boolean {
  return generatePassword(password) === user.password;
}

export function getTokenKey(id: number | string) {
  return `user#token#${id}`;
}

export function getUserKey(id: number | string) {
  return `user#${id}`;
}

export function generatePassword(password: string) {
  return md5(password);
}
export function nolmalizeGender(g: Gender): string {
  return g === Gender.Male ? '男' : g === Gender.Famale ? '女' : '';
}

export function pureUser(
  user: User,
): Pick<User, 'id' | 'realname' | 'username' | 'mobile'> & { gender: string } {
  const { id, realname, username, gender, mobile } = user;
  return {
    id,
    realname,
    username,
    gender: nolmalizeGender(gender),
    mobile,
  };
}
