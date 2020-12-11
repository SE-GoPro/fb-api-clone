import multer from 'multer';
import constants from 'common/constants';
import { InvalidParamsTypeError } from 'common/errors';

const { ValidMimeTypes } = constants;

const upload = multer({
  fileFilter: (req, file, cb) => {
    const { mimetype } = file;
    if (!ValidMimeTypes.includes(mimetype)) {
      cb(new InvalidParamsTypeError());
    }
    cb(null, true);
  },
});

export function uploadSingle(fieldName) {
  return upload.single(fieldName);
}

export function uploadMulti(fieldName, maxCount) {
  return upload.array(fieldName, maxCount);
}
