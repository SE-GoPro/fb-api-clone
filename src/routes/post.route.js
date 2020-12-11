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

router.post(
  '/delete_post',
  verifyToken,
  postController.deletePost,
);

router.post(
  '/report_post',
  verifyToken,
  postController.reportPost,
);

router.post(
  '/edit_post',
  verifyToken,
  postController.editPost,
);

export default router;
