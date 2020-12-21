import { InvalidTokenError } from 'common/errors';
import jwt from 'jsonwebtoken';
import Token from 'models/Token';

export default async function verifyOptionalToken(req, _res, next) {
  try {
    const { token } = req.query;
    if (token) {
      const tokenData = await Token.findOne({ where: { token } });
      if (!tokenData) throw new InvalidTokenError();

      jwt.verify(token, process.env.TOKEN_SECRET, (err, data) => {
        if (err) throw new InvalidTokenError();
        req.credentials = data;
      });
    }
    return next();
  } catch (e) {
    return next(e);
  }
}
