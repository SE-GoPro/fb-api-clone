import { Router } from 'express';
import verifyToken from 'middlewares/verifyToken';
import searchValidation from 'validations/search.validation';
import searchController from 'controllers/search.controller';

const router = Router();

router.post(
  '/search',
  searchValidation.search,
  verifyToken,
  searchController.search,
);

router.post(
  '/get_saved_search',
  searchValidation.getSavedSearch,
  verifyToken,
  searchController.getSavedSearch,
);

router.post(
  '/del_saved_search',
  searchValidation.delSavedSearch,
  verifyToken,
  searchController.delSavedSearch,
);

export default router;
