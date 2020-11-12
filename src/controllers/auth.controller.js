import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import User from 'models/User';
import Token from 'models/Token';
import {
  AlreadyDoneActionError,
  ExistedUserError,
  InvalidParamsValueError,
  InvalidPasswordError,
  NotValidatedUserError,
  NotVerifiedUserError,
} from 'common/errors';
import { compareHash, hashPassword } from 'utils/commonUtils';
import constants from 'common/constants';
import sequelize from 'utils/sequelize';

function signToken(credentials) {
  const nonce = crypto.randomBytes(6).toString('hex');
  return jwt.sign({ nonce, ...credentials }, process.env.TOKEN_SECRET, { algorithm: 'HS256' });
}

export default {
  signup: async ({ phonenumber, password }) => {
    const exUser = await User.findOne({ where: { phonenumber } });
    if (exUser) throw new ExistedUserError();

    const hash = await hashPassword(password);
    const verifyCode = crypto.randomBytes(3).toString('hex');

    await User.create({
      phonenumber,
      password: hash,
      verify_code: verifyCode,
    });
    return { verify_code: verifyCode };
  },

  login: async ({ phonenumber, password }) => {
    const user = await User.findOne({ where: { phonenumber } });

    if (!user) throw new NotValidatedUserError();
    if (!await compareHash(password, user.password)) throw new InvalidPasswordError();
    if (!user.is_verified) throw new NotVerifiedUserError();

    const token = signToken({ userId: user.id });

    await Token.updateToken(user.id, token);
    return {
      id: user.id,
      username: user.name,
      token,
      avatar: user.avatar_url,
    };
  },

  logout: ({ userId, token }) => Token.destroy({ where: { user_id: userId, token } }),

  getVerifyCode: async ({ phonenumber }) => {
    const user = await User.findOne({ where: { phonenumber }, attributes: ['id', 'verify_code', 'is_verified', 'last_verified_at'] });
    if (!user) throw new NotValidatedUserError();

    if (user.is_verified
      || Date.now() - user.last_verified_at < constants.MIN_RE_VERIFYING_TIME
    ) throw new AlreadyDoneActionError();

    await User.updateVerifiedTime(user.id);
    return { code: user.verify_code };
  },

  checkVerifyCode: async ({ phonenumber, verifyCode }) => {
    const user = await User.findOne({ where: { phonenumber, verify_code: verifyCode } });

    if (!user) throw new InvalidParamsValueError({ message: 'Verify code is not matched' });
    if (user.is_verified) throw new ExistedUserError();
    const token = signToken({ user_id: user.id });

    await sequelize.transaction(async t => {
      await User.update({ is_verified: true }, { where: { id: user.id }, transaction: t });
      await Token.create({ user_id: user.id, token }, { transaction: t });
    });
    return {
      token,
      id: user.id,
    };
  },
};
