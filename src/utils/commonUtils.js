import { compare, hash, genSalt } from 'bcrypt';

const { SALT_ROUNDS } = process.env;

export async function hashPassword(plainPwd) {
  const salt = await genSalt(Number(SALT_ROUNDS));
  return hash(plainPwd, salt);
}

export function compareHash(plainTxt, hash) {
  return compare(plainTxt, hash);
}
