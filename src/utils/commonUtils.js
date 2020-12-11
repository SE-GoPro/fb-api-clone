import { compare, hash, genSalt } from 'bcrypt';

const { SALT_ROUNDS } = process.env;

/**
 *
 * @param {string} plainPwd
 */
export async function hashPassword(plainPwd) {
  const salt = await genSalt(Number(SALT_ROUNDS));
  return hash(plainPwd, salt);
}

/**
 *
 * @param {string} plainTxt
 * @param {string} hash
 */
export function compareHash(plainTxt, hash) {
  return compare(plainTxt, hash);
}

/**
 *
 * @param {Date} timestamp
 */
export function getUNIXSeconds(timestamp) {
  return (timestamp.getTime() / 1000).toFixed(0);
}
