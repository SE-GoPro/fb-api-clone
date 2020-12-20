import friendController from 'controllers/friend.controller';
import { Router } from 'express';
import verifyToken from 'middlewares/verifyToken';
import friendValidation from 'validations/friend.validation';

const router = Router();

router.post(
  '/get_requested_friends',
  friendValidation.getRequestedFriends,
  verifyToken,
  friendController.getRequestedFriends,
);

export default router;
