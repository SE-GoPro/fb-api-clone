const MIN_RE_VERIFYING_TIME = 12000;
const HASH_TAG_MARK = '#';
const MAX_SEARCH_COUNT = 20;
const MAX_KEY_WORD_COUNT = 20;
const MAX_CHANGE_USERNAME_FAIL_COUNT = 10;
const MAX_IMAGE_NUMBER = 4;
const MAX_VIDEO_NUMBER = 1;
const MAX_FRIENDS = 500;

const ResponseCodes = {
  // Server common codes
  NOT_FOUND_ENDPOINT_ERROR: '404',
  INTERNAL_SERVER_ERROR: '500',

  // Common response codes
  WRONG_PASSWORD: '40000',
  UNAUTHORIZED: '40100',
  NOT_VERIFIED_USER: '40101',

  // Spec response codes
  SUCCESS: '1000',
  DB_CONNECTION_ERROR: '1001',
  NOT_ENOUGH_PARAM: '1002',
  INVALID_PARAM_TYPE: '1003',
  INVALID_PARAM_VALUE: '1004',
  UNKNOWN_ERROR: '1005',
  EXCEEDED_FILE_SIZE: '1006',
  UPLOAD_FAILED: '1007',
  EXCEEDED_IMAGE_NUMBER: '1008',
  NOT_ACCESS: '1009',
  ALREADY_DONE_ACTION: '1010',
  UNPUBLISHABLE_POST: '1011',
  LIMITED_POST_ACCESS: '1012',
  // BANNED_POST: '9992',
  NOT_EXISTED_POST: '9992',
  INCORECT_VERIFY_CODE: '9993',
  NO_DATA: '9994',
  NOT_VALIDATE_USER: '9995',
  EXISTED_USER: '9996',
  INVALID_METHOD: '9997',
  INVALID_TOKEN: '9998',
  EXCEPTION_ERROR: '9999',
};

const ValidMimeTypes = [
  'image/jpeg',
  'image/png',
  'video/mp4',
];

const Categories = {
  GROUP: 1,
  VIDEO: 2,
  MARKETPLACE: 3,
};

export default {
  MIN_RE_VERIFYING_TIME,
  HASH_TAG_MARK,
  MAX_SEARCH_COUNT,
  MAX_KEY_WORD_COUNT,
  MAX_CHANGE_USERNAME_FAIL_COUNT,
  MAX_IMAGE_NUMBER,
  MAX_VIDEO_NUMBER,
  MAX_FRIENDS,
  ResponseCodes,
  ValidMimeTypes,
  Categories,
};
