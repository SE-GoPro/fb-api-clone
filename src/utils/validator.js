import {
  InvalidParamsTypeError,
  InvalidParamsValueError,
  NotEnoughParamsError,
} from 'common/errors';

class StringValidator {
  /**
   *
   * @param {RegExp} regex
   * @param {string} errorMsg
   */
  constructor(regex, errorMsg) {
    this.regex = regex;
    this.errorMsg = errorMsg;
  }

  /**
   *
   * @param {string} str
   */
  validate(str) {
    if (typeof str !== 'string') throw new InvalidParamsTypeError();
    if (!str.match(this.regex)) throw new InvalidParamsValueError({ message: this.errorMsg });
  }
}

const phoneValidator = new StringValidator(RegExp(/^[0][0-9]{9}$/g), 'Phonenumber must be 10 in length, contain only numeric characters and start with 0');

const verifyCodeValidator = new StringValidator(RegExp(/^[0-9a-zA-Z]{6}$/g), 'Verify code must be 6 in length and contain only alphanumeric characters');

const passwordValidator = new StringValidator(RegExp(/^[0-9a-zA-Z]{6,10}$/g), 'Password must be 6 to 10 in length');

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
