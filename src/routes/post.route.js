import { Router } from 'express';
import asyncRoute from 'utils/asyncRoute';
import handleResponse from 'utils/handleResponses';
import verifyToken from 'middlewares/verifyToken';
import postController from 'controllers/post.controller';

const router = Router();

router.post('/add_post', verifyToken, asyncRoute(async (req, res) => {
  const {
    token, described, status,
  } = req.query;
  const data = await postController.addPost(token, described, status);

  return handleResponse(res, data);
}));

export default router;
