import { Router } from 'express';
import asyncRoute from 'utils/asyncRoute';
import verifyToken from 'middlewares/verifyToken';
import searchValidation from 'validations/search.validation';
import handleResponse from 'utils/handleResponses';
import searchController from 'controllers/search.controller';

const router = Router();

router.post(
  '/search',
  searchValidation.search,
  verifyToken,
  asyncRoute(async (req, res) => {
    const { keyword, index, count } = req.query;
    const { userId } = req.credentials;

    const data = await searchController.search({
      userId,
      keyword,
      index,
      count,
    });

    return handleResponse(res, data);
  }),
);

router.post(
  '/get_saved_search',
  searchValidation.getSavedSearch,
  verifyToken,
  asyncRoute(async (req, res) => {
    const { index, count } = req.query;
    const { userId } = req.credentials;

    const data = await searchController.getSavedSearch({
      userId,
      index,
      count,
    });

    return handleResponse(res, data);
  }),
);

router.post(
  '/del_saved_search',
  searchValidation.delSavedSearch,
  verifyToken,
  asyncRoute(async (req, res) => {
    const { search_id: searchId, all } = req.query;
    const { userId } = req.credentials;

    await searchController.delSavedSearch({
      userId,
      searchId,
      all,
    });

    return handleResponse(res);
  }),
);

export default router;
