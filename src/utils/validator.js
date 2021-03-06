import { URL } from 'url';
import lcs from 'node-lcs';
import {
  InvalidParamsTypeError,
  InvalidParamsValueError,
  NotEnoughParamsError,
} from 'common/errors';

/**
 *
 * @param {RegExp} regex
 * @param {string} paramValue
 */
function validateParam(regex, paramValue) {
  if (typeof paramValue !== 'string') throw new InvalidParamsTypeError();
  if (!paramValue.match(regex)) throw new InvalidParamsValueError();
}

const phoneValidator = (phone) => validateParam(RegExp(/^[0][0-9]{9}$/g), phone);

const verifyCodeValidator = (code) => validateParam(RegExp(/^[0-9a-zA-Z]{6}$/g), code);

const passwordValidator = (password) => validateParam(RegExp(/^[0-9a-zA-Z]{6,10}$/g), password);

const userNameValidator = (name) => validateParam(RegExp(/[\w\d]+/g), name);

export {
  phoneValidator,
  verifyCodeValidator,
  passwordValidator,
  userNameValidator,
};

/**
 *
 * @param {any} requestObject
 * @param {string[]} fields
 */
export function checkRequiredFields(requestObject, fields) {
  if (fields.some(field => !requestObject[field])) throw new NotEnoughParamsError();
}

export function checkInteger(value) {
  const parsedValue = parseInt(value, 10);
  if (!Number.isInteger(parsedValue) || parsedValue < 0) throw new InvalidParamsTypeError();
}

export function checkBit(value) {
  const parsedValue = parseInt(value, 10);
  if (!Number.isInteger(parsedValue) || parsedValue < 0) throw new InvalidParamsTypeError();
  if (parsedValue !== 0 && parsedValue !== 1) throw InvalidParamsValueError();
}

export function isURL(str) {
  try {
    const url = new URL(str);
    if (url) return true;
    return false;
  } catch (e) {
    return false;
  }
}

export function isSimilarPassword(oldPwd, newPwd) {
  const { length, sequence } = lcs(oldPwd, newPwd);
  const matchSeqs = newPwd.match(RegExp(sequence, 'g'));
  if (length !== 0 && matchSeqs && matchSeqs.length === 1) {
    return length / oldPwd.length >= 0.8;
  }
  return false;
}
