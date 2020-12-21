import blockController from 'controllers/block.controller';
import { Router } from 'express';
import verifyToken from 'middlewares/verifyToken';
import blockValidation from 'validations/block.validation';

const router = Router();

router.post(
  '/get_list_blocks',
  blockValidation.getListBlocks,
  verifyToken,
  blockController.getListBlocks,
);

export default router;
