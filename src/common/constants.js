const MIN_RE_VERIFYING_TIME = 12000;
const HASH_TAG_MARK = '#';
const MAX_SEARCH_COUNT = 20;
const MAX_KEY_WORD_COUNT = 20;

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

  NOT_ENOUGH_PARAM: '1002',
  INVALID_PARAM_TYPE: '1003',
  INVALID_PARAM_VALUE: '1004',
  ALREADY_DONE_ACTION: '1010',
  BANNED_POST: '9992',
  NO_DATA: '9994',
  NOT_VALIDATE_USER: '9995',
  EXISTED_USER: '9996',
  INVALID_TOKEN: '9998',
  EXCEPTION_ERROR: '9999',
};

const ValidMimeTypes = [
  'image/jpeg',
  'image/png',
  'video/mp4',
];

export default {
  MIN_RE_VERIFYING_TIME,
  HASH_TAG_MARK,
  MAX_SEARCH_COUNT,
  MAX_KEY_WORD_COUNT,
  ResponseCodes,
  ValidMimeTypes,
};
