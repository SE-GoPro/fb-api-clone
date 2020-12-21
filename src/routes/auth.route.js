import { Router } from 'express';
import authController from 'controllers/auth.controller';
import verifyLogoutToken from 'middlewares/verifyLogoutToken';
import { uploadSingle } from 'middlewares/uploadMiddlewares';
import authValidation from 'validations/auth.validation';
import verifyToken from 'middlewares/verifyToken';

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

router.post(
  '/change_info_after_signup',
  authValidation.changeInfoAfterSignup,
  uploadSingle('avatar'),
  verifyToken,
  authController.changeInfoAfterSignup,
);

router.post(
  '/change_password',
  authValidation.changePassword,
  verifyToken,
  authController.changePassword,
);

export default router;
