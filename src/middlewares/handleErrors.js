import { ServerAPIError } from 'common/errors';
import { ValidationError } from 'sequelize';

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
        code: '1004',
        message: `Parameters value is invalid: ${err.message.replace(/Validation error: /g, '').replace(/\n/g, ' ')}`, // Remove 'Validation error: ' prefix
        data: null,
      });
    } else {
      res.status(500).json({
        code: '500',
        message: 'Internal Server Error',
        data: null,
      });
      console.log(err.message);
    }
  }
  return next(err);
}

export function handleNotFoundError(req, res, next) {
  res.status(404).json({
    code: '400',
    message: `Endpoint ${req.method} ${req.url} Not Found`,
  });

  return next();
}
