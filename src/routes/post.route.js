import { Router } from 'express';
import multer from 'multer';
import asyncRoute from 'utils/asyncRoute';
import handleResponse from 'utils/handleResponses';
import verifyToken from 'middlewares/verifyToken';
import postController from 'controllers/post.controller';

const router = Router();
const upload = multer();

router.post(
  '/add_post',
  verifyToken,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]),
  asyncRoute(async (req, res) => {
    const { tokenData } = req;
    const { described, status } = req.query;
    const { image, video } = req.files;
    const data = await postController.addPost({
      tokenData,
      described,
      status,
      image: (image && image.length > 0) ? image[0] : null,
      video: (video && video.length > 0) ? video[0] : null,
    });

    return handleResponse(res, data);
  }),
);

export default router;
