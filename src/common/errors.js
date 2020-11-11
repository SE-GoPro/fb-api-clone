/* eslint-disable max-classes-per-file */
import constants from 'common/constants';

const { ResponseCodes } = constants;

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
      code: ResponseCodes.WRONG_PASSWORD,
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
      code: ResponseCodes.UNAUTHORIZED,
      message: 'Unauthorized',
      ...payload,
    });
  }
}

export class NotVerifiedUserError extends ServerAPIError {
  constructor({ ...payload }) {
    super({
      status: 401,
      code: ResponseCodes.NOT_VERIFIED_USER,
      message: 'User is not verified',
      ...payload,
    });
  }
}

// Spec errors
export class NotValidatedUserError extends ServerAPIError {
  constructor({ ...payload }) {
    super({
      status: 404,
      code: ResponseCodes.NOT_VERIFIED_USER,
      message: 'User is not validated',
      ...payload,
    });
  }
}

export class ExistedUserError extends ServerAPIError {
  constructor({ ...payload }) {
    super({
      status: 409,
      code: ResponseCodes.EXISTED_USER,
      message: 'User already exists',
      ...payload,
    });
  }
}

export class InvalidTokenError extends ServerAPIError {
  constructor({ ...payload }) {
    super({
      status: 401,
      code: ResponseCodes.INVALID_TOKEN,
      message: 'Token is invalid',
      ...payload,
    });
  }
}

export class NotEnoughParamsError extends ServerAPIError {
  constructor({ ...payload }) {
    super({
      code: ResponseCodes.NOT_ENOUGH_PARAM,
      status: 400,
      message: 'Parameter is not enough',
      ...payload,
    });
  }
}

export class InvalidParamsTypeError extends ServerAPIError {
  constructor({ ...payload }) {
    super({
      status: 400,
      code: ResponseCodes.INVALID_PARAM_TYPE,
      message: `Parameters type is invalid: ${payload.message || ''}`,
      data: payload.data,
    });
  }
}

export class InvalidParamsValueError extends ServerAPIError {
  constructor({ ...payload }) {
    super({
      status: 400,
      code: ResponseCodes.INVALID_PARAM_VALUE,
      message: `Parameters value is invalid: ${payload.message || ''}`,
      data: payload.data,
    });
  }
}

export class AlreadyDoneActionError extends ServerAPIError {
  constructor({ ...payload }) {
    super({
      status: 409,
      code: ResponseCodes.ALREADY_DONE_ACTION,
      message: 'Action has been done previously by this user',
      ...payload,
    });
  }
}

export class InvalidFileError extends ServerAPIError {
  constructor({ ...payload }) {
    super({
      status: 400,
      code: ResponseCodes.INVALID_PARAM_VALUE,
      message: 'Invalid file',
      ...payload,
    });
  }
}
