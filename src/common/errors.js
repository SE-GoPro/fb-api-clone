/* eslint-disable max-classes-per-file */
export class ServerAPIError extends Error {
  constructor({
    status, code, message, data,
  }) {
    super();
    this.status = status;
    this.code = code;
    this.message = message;
    this.data = data || null;
  }
}

export class UnauthorizedError extends ServerAPIError {
  constructor({ ...data }) {
    super({
      status: 401,
      code: '40100',
      message: 'Unauthorized',
      ...data,
    });
  }
}

export class InvalidTokenError extends ServerAPIError {
  constructor({ ...data }) {
    super({
      status: 401,
      code: '9998',
      message: 'Token is invalid',
      ...data,
    });
  }
}

export class ExistedUserError extends ServerAPIError {
  constructor({ ...data }) {
    super({
      status: 409,
      code: '9996',
      message: 'User already exists',
      ...data,
    });
  }
}
