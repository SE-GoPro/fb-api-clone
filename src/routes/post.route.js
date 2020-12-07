import { Router } from 'express';
import multer from 'multer';
import asyncRoute from 'utils/asyncRoute';
import handleResponse from 'utils/handleResponses';
import verifyToken from 'middlewares/verifyToken';
import postController from 'controllers/post.controller';

const router = Router();
const upload = multer();

const fieldUploadConfig = [
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 },
];

router.post('/add_post', verifyToken, upload.fields(fieldUploadConfig), asyncRoute(async (req, res) => {
  const { userId } = req.credentials;
  const { described, status } = req.query;
  if (!req.files) {
    const dataNoImageVideo = await postController.addPost({
      userId,
      described,
      status,
    });
    return handleResponse(res, dataNoImageVideo);
  }
  const { image, video } = req.files;
  const data = await postController.addPost({
    userId,
    described,
    status,
    image: (image && image.length > 0) ? image[0] : null,
    video: (video && video.length > 0) ? video[0] : null,
  });
  return handleResponse(res, data);
}));

router.post('/delete_post', verifyToken, asyncRoute(async (req, res) => {
  const { id } = req.query;
  const data = await postController.deletePost({ postId: id });
  return handleResponse(res, data);
}));

router.get('/get_post', verifyToken, asyncRoute(async (req, res) => {
  const { id } = req.query;
  const data = await postController.getPost({ postId: id });
  return handleResponse(res, data);
}));

router.post('/report_post', verifyToken, asyncRoute(async (req, res) => {
  const { id, subject, details } = req.query;
  const data = await postController.reportPost({ postId: id, subject, details });
  return handleResponse(res, data);
}));

router.post('/edit_post', verifyToken, asyncRoute(async (req, res) => {
  const { id, described, status } = req.query;
  const data = await postController.editPost({ postId: id, described, status });
  return handleResponse(res, data);
}));

export default router;
