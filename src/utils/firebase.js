import firebaseAdmin from 'firebase-admin';
import mime from 'mime-types';
import shortid from 'shortid';
import { v4 as uuidv4 } from 'uuid';
import { ExceptionError, UploadFailedError, ExceededFileSizeError } from 'common/errors';

const serviceAccount = require('secrets/fb-api-clone-gopro-firebase-adminsdk-3cyy6-cdf5e87374.json');

const FileType = {
  IMAGE: {
    extensions: ['jpg', 'jpeg', 'png'],
    prefix: 'img',
    maxSize: 4194304,
  },
  VIDEO: {
    extensions: ['mp4'],
    prefix: 'vid',
    maxSize: 10485760,
  },
};

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

const firebaseStorage = firebaseAdmin.storage();
const firebaseStorageBucket = firebaseStorage.bucket('fb-api-clone-gopro.appspot.com');

export const getFileUrl = (fileName, token) => `https://firebasestorage.googleapis.com/v0/b/fb-api-clone-gopro.appspot.com/o/${fileName}?alt=media&token=${token}`;

export const getThumbnailFileName = (fileName) => `thumb_${fileName}.png`;

const uploadFile = async (file, fileType) => {
  let hasError = false;
  if (file.size > fileType.maxSize) throw new ExceededFileSizeError();

  const fileExt = mime.extension(file.mimetype);
  if (!fileExt || !fileType.extensions.includes(fileExt)) {
    console.error('Invalid fileExt: ', fileExt);
    hasError = true;
  }
  if (!(file.buffer instanceof Buffer)) {
    console.error('File does not have Buffer: ', file);
    hasError = true;
  }
  if (hasError) {
    throw new UploadFailedError();
  }
  const timestamp = Date.now();
  const uniqueId = shortid.generate();
  const fileName = `${fileType.prefix}_${timestamp}_${uniqueId}.${fileExt}`;
  const token = uuidv4();
  try {
    await firebaseStorageBucket
      .file(fileName)
      .save(file.buffer, {
        metadata: {
          metadata: {
            firebaseStorageDownloadTokens: token,
          },
        },
      });
  } catch (error) {
    throw new UploadFailedError();
  }
  const fileUrl = getFileUrl(fileName, token);
  const thumbUrl = getFileUrl(getThumbnailFileName(fileName), token);
  return {
    fileName,
    fileUrl,
    thumbUrl,
  };
};

export const deleteFile = async (fileName) => {
  try {
    await firebaseStorageBucket.file(fileName).delete();
  } catch (error) {
    throw new ExceptionError();
  }
};

export const listFiles = async () => {
  try {
    const data = await firebaseStorageBucket.getFiles();
    return data;
  } catch (error) {
    throw new ExceptionError();
  }
};

export const uploadImage = (file) => uploadFile(file, FileType.IMAGE);

export const uploadVideo = (file) => uploadFile(file, FileType.VIDEO);
