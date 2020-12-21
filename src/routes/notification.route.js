import notificationController from 'controllers/notification.controller';
import { Router } from 'express';
import verifyToken from 'middlewares/verifyToken';
import notificationsValidation from 'validations/notifications.validation';

const router = Router();

router.post(
  '/get_push_settings',
  verifyToken,
  notificationController.getPushSettings,
);

router.post(
  '/set_push_settings',
  notificationsValidation.setPushSettings,
  verifyToken,
  notificationController.setPushSettings,
);

router.post(
  '/get_notification',
  notificationsValidation.getNotification,
  verifyToken,
  notificationController.getNotification,
);

router.post(
  '/set_read_notification',
  notificationsValidation.setReadNotification,
  verifyToken,
  notificationController.setReadNotification,
);

export default router;
