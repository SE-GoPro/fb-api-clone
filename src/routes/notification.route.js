import notificationController from 'controllers/notification.controller';
import { Router } from 'express';
import verifyToken from 'middlewares/verifyToken';

const router = Router();

router.post(
  '/get_push_settings',
  verifyToken,
  notificationController.getPushSettings,
);

router.post(
  '/set_push_settings',
  verifyToken,
  notificationController.setPushSettings,
);

export default router;
