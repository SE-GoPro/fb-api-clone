import { InvalidParamsValueError } from 'common/errors';

class Validator {
  constructor(regex, errorMsg) {
    this.regex = regex;
    this.errorMsg = errorMsg;
  }

  validate(str) {
    if (!str.match(this.regex)) throw new InvalidParamsValueError({ message: this.errorMsg });
  }
}

const phoneValidator = new Validator(RegExp(/^[0][0-9]{9}$/g), 'Phonenumber must be 10 in length, contain only numeric characters and start with 0');
const verifyCodeValidator = new Validator(RegExp(/^[0-9a-zA-Z]{6}$/g), 'Verify code must be 6 in length and contain only alphanumeric characters');

export {
  phoneValidator,
  verifyCodeValidator,
};
