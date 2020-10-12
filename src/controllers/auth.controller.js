import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { QueryTypes } from 'sequelize';

import sequelize from 'utils/sequelize';
import User from 'models/User';
import Token from 'models/Token';
import {
  AlreadyDoneActionError,
  ExistedUserError,
  InvalidParamsTypeError,
  InvalidParamsValueError,
  InvalidPasswordError,
  InvalidTokenError,
  NotEnoughParamsError,
  NotValidatedUserError,
  NotVerifiedUserError,
} from 'common/errors';
import { compareHash, hashPassword } from 'utils/commonUtils';

function signToken(credentials) {
  return jwt.sign(credentials, process.env.TOKEN_SECRET, { algorithm: 'HS256' });
}

export default {
  signup: async (phonenumber, password) => {
    if (!phonenumber || !password) throw new NotEnoughParamsError();
    if (typeof phonenumber !== 'string' || typeof password !== 'string') throw new InvalidParamsTypeError();
    if (phonenumber === password) throw new InvalidParamsValueError({ message: 'password can not be the same with phonenumber' });
    if (!password.match(/^[0-9a-zA-Z]{6,10}/g)) throw new InvalidParamsValueError({ message: 'password must be 6 to 10 in length' });

    const exUser = await User.findOne({ where: { phonenumber } });
    if (exUser) throw new ExistedUserError();

    const hash = await hashPassword(password);
    const verifyCode = crypto.randomBytes(3).toString('hex');

    await User.create({
      phonenumber,
      password: hash,
      name: phonenumber,
      verify_code: verifyCode,
    });
    return { verify_code: verifyCode };
  },

  login: async (phonenumber, password) => {
    if (!phonenumber || !password) throw NotEnoughParamsError();
    if (typeof phonenumber !== 'string' || typeof password !== 'string') throw new InvalidParamsTypeError();

    const user = await User.findOne({ where: { phonenumber } });

    if (!user) throw new NotValidatedUserError();
    if (!await compareHash(password, user.password)) throw new InvalidPasswordError();
    if (!user.is_verified) throw new NotVerifiedUserError();

    const token = signToken({ user_id: user.id });

    await Token.create({ user_id: user.id, token });
    return {
      id: user.id,
      username: user.name,
      token,
      avatar: user.avatar_url,
    };
  },

  logout: async (token) => {
    if (!token) throw new NotEnoughParamsError();
    const savedToken = await Token.findOne({ where: { token } });
    if (!savedToken) throw new InvalidTokenError();

    await Token.destroy();
  },

  getVerifyCode: async (phonenumber) => {
    if (!phonenumber) throw new NotEnoughParamsError();

    const user = await User.findOne({ where: { phonenumber }, attributes: ['id', 'verify_code', 'is_verified', 'last_verified_at'] });
    if (!user) throw new NotValidatedUserError();

    if (user.is_verified
      || Date.now() - user.last_verified_at < 12000
    ) throw new AlreadyDoneActionError();

    await sequelize.query('UPDATE users SET last_verified_at = NOW() where id = :id', { type: QueryTypes.UPDATE, replacements: { id: user.id } });
    return { code: user.verify_code };
  },

  checkVerifyCode: async (phonenumber, verifyCode) => {
    if (!phonenumber || !verifyCode) throw new NotEnoughParamsError();
    if (!phonenumber.match(/^[0][0-9]{9}$/g)) throw new InvalidParamsValueError({ message: 'Phonenumber must be 10 in length and start with 0' });
    if (!verifyCode.match(/^[0-9a-zA-Z]{6}/g)) throw new InvalidParamsValueError({ message: 'Verify code must be 6 in length and contain only alphanumeric characters' });

    const user = await User.findOne({ where: { phonenumber, verify_code: verifyCode } });

    if (!user) throw new InvalidParamsValueError({ message: 'Verify code is not matched' });
    if (user.is_verified) throw new ExistedUserError();

    await User.update({ verify_code: null, is_verified: true }, { where: { id: user.id } });
    const token = signToken({ user_id: user.id });
    return {
      token,
      id: user.id,
    };
  },
};
