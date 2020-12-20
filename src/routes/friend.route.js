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

router.post(
  '/get_user_friends',
  friendValidation.getUserFriends,
  verifyToken,
  friendController.getUserFriends,
);

router.post(
  '/set_accept_friend',
  friendValidation.setAcceptFriend,
  verifyToken,
  friendController.setAcceptFriend,
);

router.post(
  '/get_list_suggested_friends',
  friendValidation.getListSuggestedFriends,
  verifyToken,
  friendController.getListSuggestedFriends,
);

router.post(
  '/set_request_friend',
  friendValidation.setRequestFriend,
  verifyToken,
  friendController.setRequestFriend,
);

export default router;
