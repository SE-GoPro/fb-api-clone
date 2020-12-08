import { Router } from 'express';
import multer from 'multer';
import verifyToken from 'middlewares/verifyToken';
import postController from 'controllers/post.controller';

const router = Router();
const upload = multer();

const fieldUploadConfig = [
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 },
];

router.post(
  '/add_post',
  verifyToken,
  upload.fields(fieldUploadConfig),
  postController.addPost,
);

router.post(
  '/delete_post',
  verifyToken,
  postController.deletePost,
);

router.get(
  '/get_post',
  verifyToken,
  postController.getPost,
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
