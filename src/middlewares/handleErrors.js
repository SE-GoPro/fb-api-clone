import { ServerAPIError } from 'common/errors';
import { ValidationError, ConnectionError } from 'sequelize';
import constants from 'common/constants';

const { ResponseCodes } = constants;

export function handleAPIError(err, req, res, next) {
  if (err) {
    if (err instanceof ServerAPIError) {
      const {
        status, code, message, data,
      } = err;
      res.status(status).json({
        code, message, data,
      });
    } else if (err instanceof ValidationError) {
      res.status(400).json({
        code: ResponseCodes.INVALID_PARAM_VALUE,
        message: 'Parameters value is invalid',
        data: null,
      });
    } else if (err instanceof ConnectionError) {
      res.status(503).json({
        code: ResponseCodes.DB_CONNECTION_ERROR,
        message: 'Can not connect to DB',
        data: null,
      });
    } else {
      console.log(err);
      res.status(500).json({
        code: ResponseCodes.UNKNOWN_ERROR,
        message: 'Unknown error',
        data: null,
      });
    }
    return next(err);
  }
  return next();
}

export function handleNotFoundError(req, res, next) {
  res.status(404).json({
    code: ResponseCodes.NOT_FOUND_ENDPOINT_ERROR,
    message: `Endpoint ${req.method} ${req.url} Not Found`,
  });

  return next();
}
