import { InvalidTokenError, NotEnoughParamsError } from 'common/errors';
import jwt from 'jsonwebtoken';

export default async function verifyLogoutToken(req, _res, next) {
  try {
    const { token } = req.query;
    if (!token) throw new NotEnoughParamsError();

    jwt.verify(token, process.env.TOKEN_SECRET, (err) => {
      if (err) throw new InvalidTokenError();
    });
    return next();
  } catch (e) {
    return next(e);
  }
}
