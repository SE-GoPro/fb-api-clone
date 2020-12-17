import { Router } from 'express';
import verifyToken from 'middlewares/verifyToken';
import verifyOptionalToken from 'middlewares/verifyOptionalToken';
import { uploadFields } from 'middlewares/uploadMiddlewares';
import postController from 'controllers/post.controller';
import postValidation from 'validations/post.validation';

const router = Router();

const addPostUploadConfigs = [
  { name: 'image' },
  { name: 'video' },
];

router.post(
  '/add_post',
  verifyToken,
  uploadFields(addPostUploadConfigs),
  postController.addPost,
);

router.post(
  '/get_post',
  postValidation.getPost,
  verifyOptionalToken,
  postController.getPost,
);

const editPostUploadConfigs = [
  { name: 'image' },
  { name: 'video' },
  { name: 'thumb' },
];

router.post(
  '/edit_post',
  postValidation.editPost,
  verifyToken,
  uploadFields(editPostUploadConfigs),
  postController.editPost,
);

router.post(
  '/delete_post',
  postValidation.deletePost,
  verifyToken,
  postController.deletePost,
);

router.post(
  '/report_post',
  postValidation.reportPost,
  verifyToken,
  postController.reportPost,
);

router.post(
  '/get_list_posts',
  postValidation.getListPosts,
  verifyOptionalToken,
  postController.getListPosts,
);

router.post(
  '/check_new_item',
  postValidation.checkNewItem,
  postController.checkNewItem,
);

export default router;
