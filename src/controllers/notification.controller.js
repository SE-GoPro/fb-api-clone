import {
  AlreadyDoneActionError,
  NoDataError,
  NotAccessError,
  NotEnoughParamsError,
} from 'common/errors';
import Notification from 'models/Notification';
import NotificationSetting from 'models/NotificationSetting';
import { Op } from 'sequelize';
import asyncHandler from 'utils/asyncHandler';
import { getUNIXSeconds } from 'utils/commonUtils';
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

  getNotification: asyncHandler(async (req, res) => {
    const { userId, isBlocked } = req.credentials;
    if (isBlocked) throw new NotAccessError();

    const index = parseInt(req.query.index, 10);
    const count = parseInt(req.query.count, 10);

    const currentNotifications = await Notification.findAll({
      where: { user_id: userId },
      limit: count,
      offset: index,
      order: [['created', 'desc']],
    });

    if (currentNotifications.length === 0) throw new NoDataError();

    const lastNotification = currentNotifications[0];
    const lastUpdate = new Date();

    const badgeCount = await Notification.count({
      where: { created: { [Op.gt]: lastNotification[0].created }, reat_at: null, user_id: userId },
    });

    return handleResponse(res, {
      notifications: currentNotifications.map(notification => ({
        type: notification.type,
        object_id: notification.object_id,
        title: notification.title,
        notification_id: notification.id,
        created: getUNIXSeconds(notification.created),
        avatar: notification.avatar,
        group: notification.group,
        read: notification.reat_at ? '1' : '0',
      })),
      last_update: getUNIXSeconds(lastUpdate),
      badge: String(badgeCount),
    });
  }),

  setReadNotification: asyncHandler(async (req, res) => {
    const { userId, isBlocked } = req.credentials;
    if (isBlocked) throw new NotAccessError();

    const { notification_id: notificationId } = req.query;

    await Notification.update(
      { read_at: Date.now() },
      { where: { id: notificationId } },
    );

    const lastUpdate = new Date();
    const badgeCount = await Notification.count({ where: { reat_at: null, user_id: userId } });

    return handleResponse(res, {
      badge: String(badgeCount),
      last_update: getUNIXSeconds(lastUpdate),
    });
  }),
};
