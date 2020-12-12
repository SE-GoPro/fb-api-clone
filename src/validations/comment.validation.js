import { checkRequiredFields, checkInteger } from 'utils/validator';

export default {
  getComment: (req, res, next) => {
    checkRequiredFields(req.query, ['id', 'index', 'count']);

    const { index, count } = req.query;
    checkInteger(index);
    checkInteger(count);

    return next();
  },

  setComment: (req, res, next) => {
    checkRequiredFields(req.query, ['id', 'comment', 'index', 'count']);

    const { index, count } = req.query;
    checkInteger(index);
    checkInteger(count);

    return next();
  },
};
