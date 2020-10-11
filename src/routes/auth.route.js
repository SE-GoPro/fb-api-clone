import authController from 'controllers/auth.controller';
import { Router } from 'express';

const router = Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/get_verify_code', authController.getVerifyCode);
router.post('/check_verify_code', authController.checkVerifyCode);

export default router;
