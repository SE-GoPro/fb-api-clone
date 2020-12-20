import { checkBit } from 'utils/validator';

export default {
  setPushSettings: (req, res, next) => {
    [
      'like_comment',
      'from_friends',
      'requested_friend',
      'suggested_friend',
      'birthday',
      'video',
      'report',
      'sound_on',
      'notification_on',
      'vibrant_on',
      'led_on',
    ].forEach(key => {
      if (req.query[key]) {
        checkBit(req.query[key]);
      }
    });

    return next();
  },
};
