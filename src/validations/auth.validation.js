import {
  InvalidParamsValueError,
} from 'common/errors';

import {
  phoneValidator,
  passwordValidator,
  checkRequiredFields,
  verifyCodeValidator,
} from 'utils/validator';

export default {
  signup: (req, res, next) => {
    checkRequiredFields(req.body, ['phonenumber', 'password']);

    const { phonenumber, password } = req.body;
    phoneValidator.validate(phonenumber);
    passwordValidator.validate(password);

    if (phonenumber === password) throw new InvalidParamsValueError({ message: 'password can not be the same with phonenumber' });
    return next();
  },

  login: (req, res, next) => {
    checkRequiredFields(req.body, ['phonenumber', 'password']);
    const { phonenumber, password } = req.body;
    phoneValidator.validate(phonenumber);
    passwordValidator.validate(password);

    return next();
  },

  logout: (req, res, next) => {
    checkRequiredFields(req.body, ['token']);
    return next();
  },

  getVerifyCode: (req, res, next) => {
    checkRequiredFields(req.body, ['phonenumber']);
    phoneValidator.validate(req.body.phonenumber);

    return next();
  },

  checkVerifyCode: (req, res, next) => {
    checkRequiredFields(req.body, ['phonenumber, code_verify']);
    const { phonenumber, code_verify: verifyCode } = req.body;
    phoneValidator.validate(phonenumber);
    verifyCodeValidator.validate(verifyCode);

    return next();
  },
};
