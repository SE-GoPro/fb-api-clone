import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import asyncHandler from 'utils/asyncHandler';
import User from 'models/User';
import Token from 'models/Token';
import UserFailAction from 'models/UserFailAction';
import {
  AlreadyDoneActionError,
  ExistedUserError,
  InvalidPasswordError,
  NotValidatedUserError,
  ExceptionError,
  InvalidParamsValueError,
  NotAccessError,
  ExceededFileSizeError,
} from 'common/errors';
import { compareHash, getUNIXSeconds, hashPassword } from 'utils/commonUtils';
import constants from 'common/constants';
import sequelize from 'utils/sequelize';
import handleResponse from 'utils/handleResponses';
import { uploadImage } from 'utils/firebase';
import { isURL } from 'utils/validator';

function signToken(credentials) {
  const nonce = crypto.randomBytes(6).toString('hex');
  return jwt.sign({ nonce, ...credentials }, process.env.TOKEN_SECRET, { algorithm: 'HS256' });
}

export default {
  signup: asyncHandler(async (req, res) => {
    const { phonenumber, password } = req.query;
    const exUser = await User.findOne({ where: { phonenumber } });
    if (exUser) throw new ExistedUserError();

    const hash = await hashPassword(password);
    const verifyCode = crypto.randomBytes(3).toString('hex');

    await User.create({
      phonenumber,
      password: hash,
      verify_code: verifyCode,
    });
    return handleResponse(res, { code_verify: verifyCode });
  }),

  login: asyncHandler(async (req, res) => {
    const { phonenumber, password } = req.query;
    const user = await User.findOne({ where: { phonenumber } });

    if (!user) throw new NotValidatedUserError();
    if (!await compareHash(password, user.password)) throw new InvalidPasswordError();
    if (!user.is_verified) throw new NotValidatedUserError();

    const token = signToken({ userId: user.id, isBlocked: user.is_blocked });

    await Token.updateToken(user.id, token);
    return handleResponse(res, {
      id: user.id,
      username: user.name,
      token,
      avatar: user.avatar_url,
    });
  }),

  logout: asyncHandler(async (req, res) => {
    const { token } = req.query;
    await Token.destroy({ where: { token } });
    return handleResponse(res);
  }),

  getVerifyCode: asyncHandler(async (req, res) => {
    const { phonenumber } = req.query;
    const user = await User.findOne({ where: { phonenumber }, attributes: ['id', 'verify_code', 'is_verified', 'last_verified_at'] });
    if (!user) throw new NotValidatedUserError();

    if (user.is_verified
      || Date.now() - user.last_verified_at < constants.MIN_RE_VERIFYING_TIME
    ) throw new AlreadyDoneActionError();

    await User.updateVerifiedTime(user.id);
    return handleResponse(res, { code_verify: user.verify_code });
  }),

  checkVerifyCode: asyncHandler(async (req, res) => {
    const { phonenumber, code_verify: verifyCode } = req.query;
    const user = await User.findOne({ where: { phonenumber, verify_code: verifyCode } });

    if (!user) throw new NotValidatedUserError();
    if (user.is_verified) throw new ExistedUserError();
    const token = signToken({ user_id: user.id, isBlocked: user.is_blocked });

    await sequelize.transaction(async t => {
      await User.update({ is_verified: true }, { where: { id: user.id }, transaction: t });
      await Token.updateToken(user.id, token, t);
    });
    return handleResponse(res, {
      token,
      id: user.id,
    });
  }),

  changeInfoAfterSignup: asyncHandler(async (req, res) => {
    const { userId } = req.credentials;
    const { username } = req.query;
    const updates = { name: username };

    const user = await User.findOne({ where: { id: userId }, attributes: ['phonenumber', 'is_blocked'] });
    if (!user) throw new NotValidatedUserError();
    if (user.phonenumber === username) throw new InvalidParamsValueError();
    if (user.is_blocked) throw new NotAccessError();

    if (isURL(username)) {
      const failActions = await UserFailAction.findOne({ where: { user_id: userId }, attributes: ['change_username'] });
      if (!failActions) {
        await UserFailAction.create({ user_id: userId });
      } else {
        if (failActions.change_username === constants.MAX_CHANGE_USERNAME_FAIL_COUNT) {
          await User.update({ is_blocked: true }, { where: { id: userId } });
          throw new NotAccessError();
        }
        await UserFailAction.increment('change_username', { where: { user_id: userId } });
      }
      throw new InvalidParamsValueError();
    }

    const avatarFile = req.file || null;
    if (avatarFile) {
      const { fileUrl } = await uploadImage(avatarFile)
        .catch(() => {
          throw new ExceededFileSizeError();
        });
      Object.assign(updates, { avatar_url: fileUrl });
    }
    const result = await User.update(updates, {
      where: { id: userId },
      returning: true,
    });

    if (result[0] === 0) throw new ExceptionError();
    const [{
      id, name, phonenumber, created, avatar_url: avatar,
    }] = result[1];

    return handleResponse(res, {
      id, username: name, phonenumber, created: getUNIXSeconds(created), avatar,
    });
  }),
};
