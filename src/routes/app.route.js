import appController from 'controllers/app.controller';
import { Router } from 'express';
import verifyOptionalToken from 'middlewares/verifyOptionalToken';

const router = Router();

router.post(
  '/check_new_version',
  verifyOptionalToken,
  appController.checkNewVersion,
);

export default router;
