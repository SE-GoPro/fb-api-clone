import { ServerAPIError } from 'common/errors';

export function handleAPIError(err, req, res, next) {
  if (err) {
    if (err instanceof ServerAPIError) {
      const {
        status, code, message, data,
      } = err;
      res.status(status).json({
        code, message, data,
      });
    } else {
      res.status(500).json({
        code: '500',
        message: 'Internal Server Error',
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
