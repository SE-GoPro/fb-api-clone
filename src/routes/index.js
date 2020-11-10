import { Router } from 'express';
import authRoutes from 'routes/auth.route';
import postRoutes from 'routes/post.route';

const router = Router();

router.use(authRoutes);
router.use(postRoutes);

export default router;
