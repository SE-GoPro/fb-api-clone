import {
  AlreadyDoneActionError,
  NotAccessError,
  NotEnoughParamsError,
} from 'common/errors';
import NotificationSetting from 'models/NotificationSetting';
import asyncHandler from 'utils/asyncHandler';
import handleResponse from 'utils/handleResponses';

export default {
  getPushSettings: asyncHandler(async (req, res) => {
    const { userId, isBlocked } = req.credentials;
    if (isBlocked) throw new NotAccessError();

    let settings;
    settings = await NotificationSetting.findOne({ where: { user_id: userId } });

    if (!settings) {
      settings = await NotificationSetting.create({ user_id: userId });
    }

    const settingsData = JSON.parse(JSON.stringify(settings));
    const responseData = {};
    Object.keys(settingsData).forEach(key => {
      if (key !== 'user_id') {
        responseData[key] = settingsData[key] ? '1' : '0';
      }
    });

    return handleResponse(res, responseData);
  }),

  setPushSettings: asyncHandler(async (req, res) => {
    const { userId, isBlocked } = req.credentials;
    if (isBlocked) throw new NotAccessError();

    const settingsData = {};
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
      const keyValue = parseInt(req.query[key], 10);
      settingsData[key] = keyValue !== 0;
    });

    if (Object.keys(settingsData).length === 0) throw NotEnoughParamsError();

    let currentSettings = await NotificationSetting.findOne({ where: { user_id: userId } });
    if (!currentSettings) {
      currentSettings = await NotificationSetting.create({ user_id: userId });
    }

    if (Object.keys(settingsData).some(key => settingsData[key] === currentSettings[key])) {
      throw new AlreadyDoneActionError();
    }
    return handleResponse(res);
  }),
};
