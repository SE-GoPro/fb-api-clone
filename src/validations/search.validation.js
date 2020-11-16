import { InvalidParamsValueError, NotEnoughParamsError } from 'common/errors';
import {
  checkInteger,
  checkRequiredFields,
} from 'utils/validator';

export default {
  search: (req, res, next) => {
    checkRequiredFields(req.query, ['keyword', 'index', 'count']);

    const { index, count, keyword } = req.query;
    if (keyword.trim().length === 0) throw new InvalidParamsValueError({ message: 'Keyword is empty!' });
    checkInteger(index);
    checkInteger(count);

    return next();
  },

  getSavedSearch: (req, res, next) => {
    checkRequiredFields(req.query, ['index', 'count']);
    const { index, count } = req.query;
    checkInteger(index);
    checkInteger(count);

    return next();
  },

  delSavedSearch: (req, res, next) => {
    const { search_id: searchId, all } = req.query;
    const isAll = parseInt(all, 10);
    if (isAll !== 1 && isAll !== 0) throw new InvalidParamsValueError({ message: 'Invalid value of "all" (0 or 1 allowed)' });
    if (!isAll) {
      if (!searchId) throw new NotEnoughParamsError();
    }
    if (searchId) {
      checkInteger(searchId);
      if (parseInt(searchId, 10) <= 0) throw new InvalidParamsValueError({ message: 'search_id must be greater than 0' });
    }

    return next();
  },
};
