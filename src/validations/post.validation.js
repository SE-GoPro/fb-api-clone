import { InvalidParamsValueError } from 'common/errors';
import { checkInteger, checkRequiredFields } from 'utils/validator';

export default {
  getPost: (req, res, next) => {
    checkRequiredFields(req.query, ['id']);
    return next();
  },

  editPost: (req, res, next) => {
    checkRequiredFields(req.query, ['id']);
    return next();
  },

  deletePost: (req, res, next) => {
    checkRequiredFields(req.query, ['id']);
    return next();
  },

  reportPost: (req, res, next) => {
    checkRequiredFields(req.query, ['id', 'subject', 'details']);
    return next();
  },

  getListPosts: (req, res, next) => {
    checkRequiredFields(req.query, ['index', 'count']);

    const { index, count } = req.query;
    checkInteger(index);
    checkInteger(count);
    if (req.query.last_id) checkInteger(req.query.last_id);

    return next();
  },

  checkNewItem: (req, res, next) => {
    checkRequiredFields(req.query, ['last_id']);
    checkInteger(req.query.last_id);
    if (req.query.category_id) {
      checkInteger(req.query.category_id);
      const categoryId = parseInt(req.query.category_id, 10);
      if (categoryId < 0 || categoryId > 3) throw new InvalidParamsValueError();
    }
    return next();
  },

  getListVideos: (req, res, next) => {
    checkRequiredFields(req.query, ['index', 'count']);

    const { index, count } = req.query;
    checkInteger(index);
    checkInteger(count);
    if (req.query.last_id) checkInteger(req.query.last_id);

    return next();
  },
};
