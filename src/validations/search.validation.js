import { InvalidParamsValueError, NotEnoughParamsError } from 'common/errors';
import {
  checkBit,
  checkInteger,
  checkRequiredFields,
} from 'utils/validator';

export default {
  search: (req, res, next) => {
    checkRequiredFields(req.query, ['keyword', 'index', 'count']);

    const { index, count, keyword } = req.query;
    if (keyword.trim().length === 0) throw new InvalidParamsValueError();
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
    checkBit(all);
    const isAll = parseInt(all, 10);
    if (!isAll) {
      if (!searchId) throw new NotEnoughParamsError();
    }
    if (searchId) {
      checkInteger(searchId);
      if (parseInt(searchId, 10) <= 0) throw new InvalidParamsValueError();
    }

    return next();
  },
};
