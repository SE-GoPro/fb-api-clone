import { Router } from 'express';
import authRoutes from 'routes/auth.route';
import postRoutes from 'routes/post.route';
import searchRoutes from 'routes/search.route';
import likeRoutes from 'routes/like.route';
import commentRoutes from 'routes/comment.route';
import friendRoutes from 'routes/friend.route';
import notificationRoutes from 'routes/notification.route';
import blockRoutes from 'routes/block.route';

const router = Router();

router.use(authRoutes);
router.use(postRoutes);
router.use(searchRoutes);
router.use(likeRoutes);
router.use(commentRoutes);
router.use(friendRoutes);
router.use(notificationRoutes);
router.use(blockRoutes);

export default router;
