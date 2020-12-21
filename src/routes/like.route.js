import likeController from 'controllers/like.controller';
import { Router } from 'express';
import verifyToken from 'middlewares/verifyToken';
import likeValidation from 'validations/like.validation';

const router = Router();

router.post(
  '/like',
  likeValidation.like,
  verifyToken,
  likeController.like,
);

export default router;
