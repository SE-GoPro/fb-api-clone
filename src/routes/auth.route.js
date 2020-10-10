import authController from 'controllers/auth.controller';
import { Router } from 'express';

const router = Router();

router.post('/signup', authController.signup);

export default router;
