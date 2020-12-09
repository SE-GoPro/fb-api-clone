import { Router } from 'express';
import authController from 'controllers/auth.controller';
import verifyLogoutToken from 'middlewares/verifyLogoutToken';
import authValidation from 'validations/auth.validation';

const router = Router();

router.post(
  '/signup',
  authValidation.signup,
  authController.signup,
);

router.post(
  '/login',
  authValidation.login,
  authController.login,
);

router.post(
  '/logout',
  verifyLogoutToken,
  authController.logout,
);

router.post(
  '/get_verify_code',
  authValidation.getVerifyCode,
  authController.getVerifyCode,
);

router.post(
  '/check_verify_code',
  authValidation.checkVerifyCode,
  authController.checkVerifyCode,
);

export default router;
