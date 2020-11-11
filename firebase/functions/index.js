/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Modified by namdaoduy.
 *
 * Generate png thumbnail from video.
 */

// [START import]
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const { spawn } = require('child-process-promise');
const path = require('path');
const os = require('os');
const fs = require('fs');
// [END import]

// [START generateThumbnail]
/**
 * When an image is uploaded in the Storage bucket We generate a thumbnail automatically using
 * ImageMagick.
 */
// [START generateThumbnailTrigger]
exports.generateThumbnail = functions.region('asia-east2').storage.object().onFinalize(async (object) => {
// [END generateThumbnailTrigger]
  console.log(`New file created: ${object.name}`);
  // [START eventAttributes]
  const fileBucket = object.bucket; // The Storage bucket that contains the file.
  const filePath = object.name; // File path in the bucket.
  const { contentType, metadata } = object; // File content type.
  // [END eventAttributes]

  // [START stopConditions]
  // Exit if this is triggered on a file that is not an image.
  if (!contentType.startsWith('video/mp4')) {
    return console.log(`This is not a video (expect: video/mp4, actual: ${contentType})`);
  }
  // Get the file name.
  const fileName = path.basename(filePath);
  if (!fileName.startsWith('vid_')) {
    return console.log(`This is not a video (fileName: ${fileName})`);
  }
  // [END stopConditions]

  // [START thumbnailGeneration]
  // Download file from bucket.
  const bucket = admin.storage().bucket(fileBucket);
  const tempFilePath = path.join(os.tmpdir(), fileName);
  await bucket.file(filePath).download({ destination: tempFilePath });
  console.log('Video downloaded locally to', tempFilePath);
  // We add a 'thumb_' prefix to thumbnails file name. That's where we'll upload the thumbnail.
  const thumbFileName = `thumb_${fileName}.png`;
  const thumbFilePath = path.join(path.dirname(filePath), thumbFileName);
  const tempThumbFilePath = path.join(os.tmpdir(), thumbFileName);
  // Generate a thumbnail using ImageMagick.
  await spawn('convert', [`${tempFilePath}[0]`, tempThumbFilePath]);
  // Uploading the thumbnail.
  await bucket.upload(tempThumbFilePath, {
    destination: thumbFilePath,
    metadata: {
      contentType: 'image/png',
      metadata: {
        firebaseStorageDownloadTokens: metadata.firebaseStorageDownloadTokens,
      },
    },
  });
  // Once the thumbnail has been uploaded delete the local file to free up disk space.
  fs.unlinkSync(tempFilePath);
  fs.unlinkSync(tempThumbFilePath);
  return console.log('Thumbnail created: ', thumbFileName);
  // [END thumbnailGeneration]
});
// [END generateThumbnail]
