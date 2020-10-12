import { InvalidTokenError, UnauthorizedError } from 'common/errors';
import jwt from 'jsonwebtoken';
import Token from 'models/Token';

export default async function verifyToken(req, res, next) {
  try {
    // const bearerHeader = req.headers.authorization;
    // if (!bearerHeader) throw new UnauthorizedError();

    // const authHeaderParts = bearerHeader.split(' ');
    // if (authHeaderParts[0].toLowerCase() !== 'bearer'
    //   || !authHeaderParts[1]
    // ) throw new InvalidTokenError();

    // const token = await Token.findOne({ where: { token: authHeaderParts[1] } });
    if (!req.body.token) throw new UnauthorizedError();
    const token = await Token.findOne({ where: { token: req.body.token } });
    if (!token) throw new InvalidTokenError();
    jwt.verify(token, process.env.TOKEN_SECRET, (err, data) => {
      if (err) throw new InvalidTokenError();
      req.credentials = data;
    });
    return next();
  } catch (e) {
    return next(e);
  }
}
