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
export class NotExistedPostError extends ServerAPIError {
  constructor({ ...payload }) {
    super({
      status: 404,
      code: ResponseCodes.NOT_EXISTED_POST,
      message: 'Post is not existed',
      ...payload,
    });
  }
}

export class IncorrectVerifyCode extends ServerAPIError {
  constructor({ ...payload }) {
    super({
      status: 400,
      code: ResponseCodes.INCORECT_VERIFY_CODE,
      message: 'Code verify is incorrect',
      ...payload,
    });
  }
}

export class NoDataError extends ServerAPIError {
  constructor({ ...payload }) {
    super({
      status: 204,
      code: ResponseCodes.NO_DATA,
      message: 'No Data or end of list data',
      ...payload,
    });
  }
}

export class NotValidatedUserError extends ServerAPIError {
  constructor({ ...payload }) {
    super({
      status: 404,
      code: ResponseCodes.NOT_VALIDATE_USER,
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
      message: 'User existed',
      ...payload,
    });
  }
}

export class InvalidMethodError extends ServerAPIError {
  constructor({ ...payload }) {
    super({
      status: 400,
      code: ResponseCodes.INVALID_METHOD,
      message: 'Method is invalid',
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

export class ExceptionError extends ServerAPIError {
  constructor({ ...payload }) {
    super({
      status: 500,
      code: ResponseCodes.EXCEPTION_ERROR,
      message: 'Exception Error',
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
      message: 'Parameter type is invalid',
      data: payload.data,
    });
  }
}

export class InvalidParamsValueError extends ServerAPIError {
  constructor({ ...payload }) {
    super({
      status: 400,
      code: ResponseCodes.INVALID_PARAM_VALUE,
      message: 'Parameter value is invalid',
      data: payload.data,
    });
  }
}

export class ExceededFileSizeError extends ServerAPIError {
  constructor({ ...payload }) {
    super({
      status: 400,
      code: ResponseCodes.EXCEEDED_FILE_SIZE,
      message: 'File size is too big',
      ...payload,
    });
  }
}

export class UploadFailedError extends ServerAPIError {
  constructor({ ...payload }) {
    super({
      status: 400,
      code: ResponseCodes.UPLOAD_FAILED,
      message: 'Upload File Failed!',
      ...payload,
    });
  }
}

export class ExceededImageNumberError extends ServerAPIError {
  constructor({ ...payload }) {
    super({
      status: 400,
      code: ResponseCodes.EXCEEDED_IMAGE_NUMBER,
      message: 'Maximum number of images',
      ...payload,
    });
  }
}

export class NotAccessError extends ServerAPIError {
  constructor({ ...payload }) {
    super({
      status: 403,
      code: ResponseCodes.NOT_ACCESS,
      message: 'Not access',
      ...payload,
    });
  }
}

export class AlreadyDoneActionError extends ServerAPIError {
  constructor({ ...payload }) {
    super({
      status: 409,
      code: ResponseCodes.ALREADY_DONE_ACTION,
      message: 'action has been done previously by this user',
      ...payload,
    });
  }
}

export class UnpublishablePostError extends ServerAPIError {
  constructor({ ...payload }) {
    super({
      status: 400,
      code: ResponseCodes.UNPUBLISHABLE_POST,
      message: 'Could not publish this post',
      ...payload,
    });
  }
}

export class LimitedPostAccessError extends ServerAPIError {
  constructor({ ...payload }) {
    super({
      status: 400,
      code: ResponseCodes.LIMITED_POST_ACCESS,
      message: 'Limited access',
      ...payload,
    });
  }
}

// export class InvalidFileError extends ServerAPIError {
//   constructor({ ...payload }) {
//     super({
//       status: 400,
//       code: ResponseCodes.INVALID_PARAM_VALUE,
//       message: 'Invalid file',
//       ...payload,
//     });
//   }
// }

// export class BannedPostError extends ServerAPIError {
//   constructor({ ...payload }) {
//     super({
//       status: 400,
//       code: ResponseCodes.BANNED_POST,
//       message: 'Post is already banned',
//       ...payload,
//     });
//   }
// }

// export class ExceededVideoNumberError extends ServerAPIError {
//   constructor({ ...payload }) {
//     super({
//       status: 400,
//       code: ResponseCodes.EXCEEDED_IMAGE_NUMBER,
//       message: 'Maximum number of videos',
//       ...payload,
//     });
//   }
// }
