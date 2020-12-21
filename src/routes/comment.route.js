import commentController from 'controllers/comment.controller';
import { Router } from 'express';
import verifyOptionalToken from 'middlewares/verifyOptionalToken';
import verifyToken from 'middlewares/verifyToken';
import commentValidation from 'validations/comment.validation';

const router = Router();

router.post(
  '/get_comment',
  commentValidation.getComment,
  verifyOptionalToken,
  commentController.getComment,
);

router.post(
  '/set_comment',
  commentValidation.setComment,
  verifyToken,
  commentController.setComment,
);

export default router;
