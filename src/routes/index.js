import { Router } from 'express';
import authRoutes from 'routes/auth.route';
import postRoutes from 'routes/post.route';
import searchRoutes from 'routes/search.route';
import likeRoutes from 'routes/like.route';
import commentRoutes from 'routes/comment.route';

const router = Router();

router.use(authRoutes);
router.use(postRoutes);
router.use(searchRoutes);
router.use(likeRoutes);
router.use(commentRoutes);

export default router;
