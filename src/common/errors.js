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

// Common 400 Errors
export class InvalidPasswordError extends ServerAPIError {
  constructor({ ...payload }) {
    super({
      status: 400,
      code: '40000',
      message: 'Password is not correct',
      ...payload,
    });
  }
}

// Common 401 Errors
export class UnauthorizedError extends ServerAPIError {
  constructor({ ...payload }) {
    super({
      status: 401,
      code: '40100',
      message: 'Unauthorized',
      ...payload,
    });
  }
}

export class NotVerifiedUserError extends ServerAPIError {
  constructor({ ...payload }) {
    super({
      status: 401,
      code: '40101',
      message: 'User is not verified',
      ...payload,
    });
  }
}

export class NotValidatedUserError extends ServerAPIError {
  constructor({ ...payload }) {
    super({
      status: 404,
      code: '9995',
      message: 'User is not validated',
      ...payload,
    });
  }
}

export class ExistedUserError extends ServerAPIError {
  constructor({ ...payload }) {
    super({
      status: 409,
      code: '9996',
      message: 'User already exists',
      ...payload,
    });
  }
}

export class InvalidTokenError extends ServerAPIError {
  constructor({ ...payload }) {
    super({
      status: 401,
      code: '9998',
      message: 'Token is invalid',
      ...payload,
    });
  }
}

export class NotEnoughParamsError extends ServerAPIError {
  constructor({ ...payload }) {
    super({
      status: 400,
      code: '1002',
      message: 'Parameter is not enough',
      ...payload,
    });
  }
}

export class InvalidParamsTypeError extends ServerAPIError {
  constructor({ ...payload }) {
    super({
      status: 400,
      code: '1003',
      message: `Parameters type is invalid: ${payload.message || ''}`,
      data: payload.data,
    });
  }
}

export class InvalidParamsValueError extends ServerAPIError {
  constructor({ ...payload }) {
    super({
      status: 400,
      code: '1004',
      message: `Parameters value is invalid: ${payload.message || ''}`,
      data: payload.data,
    });
  }
}

export class AlreadyDoneActionError extends ServerAPIError {
  constructor({ ...payload }) {
    super({
      status: 409,
      code: '1010',
      message: 'Action has been done previously by this user',
      ...payload,
    });
  }
}
