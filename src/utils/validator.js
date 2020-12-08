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

export {
  phoneValidator,
  verifyCodeValidator,
  passwordValidator,
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
  if (!Number.isInteger(parseInt(value, 10))) throw new InvalidParamsTypeError();
}
