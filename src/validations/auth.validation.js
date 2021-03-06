import {
  InvalidParamsValueError,
} from 'common/errors';

import {
  phoneValidator,
  passwordValidator,
  checkRequiredFields,
  verifyCodeValidator,
  userNameValidator,
  isSimilarPassword,
} from 'utils/validator';

export default {
  signup: (req, res, next) => {
    checkRequiredFields(req.query, ['phonenumber', 'password']);

    const { phonenumber, password } = req.query;
    phoneValidator(phonenumber);
    passwordValidator(password);

    if (phonenumber === password) throw new InvalidParamsValueError();
    return next();
  },

  login: (req, res, next) => {
    checkRequiredFields(req.query, ['phonenumber', 'password']);
    const { phonenumber, password } = req.query;
    phoneValidator(phonenumber);
    passwordValidator(password);

    return next();
  },

  getVerifyCode: (req, res, next) => {
    checkRequiredFields(req.query, ['phonenumber']);
    phoneValidator(req.query.phonenumber);

    return next();
  },

  checkVerifyCode: (req, res, next) => {
    checkRequiredFields(req.query, ['phonenumber', 'code_verify']);
    const { phonenumber, code_verify: verifyCode } = req.query;
    phoneValidator(phonenumber);
    verifyCodeValidator(verifyCode);

    return next();
  },

  changeInfoAfterSignup: (req, res, next) => {
    checkRequiredFields(req.query, ['username']);
    const { username } = req.query;
    userNameValidator(username);

    return next();
  },

  changePassword: (req, res, next) => {
    checkRequiredFields(req.query, ['password', 'new_password']);

    const { password, new_password: newPassword } = req.query;
    passwordValidator(password);
    passwordValidator(newPassword);

    if (
      password === newPassword
      || isSimilarPassword(password, newPassword)
    ) throw new InvalidParamsValueError();
    return next();
  },
};
