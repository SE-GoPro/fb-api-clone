import { InvalidParamsValueError } from 'common/errors';
import { checkInteger, checkRequiredFields } from 'utils/validator';

export default {
  getRequestedFriends: (req, res, next) => {
    checkRequiredFields(req.query, ['index', 'count']);

    const { index, count } = req.query;
    checkInteger(index);
    checkInteger(count);

    return next();
  },

  getUserFriends: (req, res, next) => {
    checkRequiredFields(req.query, ['index', 'count']);

    const { index, count } = req.query;
    checkInteger(index);
    checkInteger(count);

    return next();
  },

  setAcceptFriend: (req, res, next) => {
    checkRequiredFields(req.query, ['user_id', 'is_accept']);

    checkInteger(req.query.is_accept);
    const isAcceptValue = parseInt(req.query.is_accept, 10);
    if (isAcceptValue !== 0 || isAcceptValue !== 1) throw new InvalidParamsValueError();

    return next();
  },

  getListSuggestedFriends: (req, res, next) => {
    checkRequiredFields(req.query, ['index', 'count']);

    const { index, count } = req.query;
    checkInteger(index);
    checkInteger(count);

    return next();
  },

  setRequestFriend: (req, res, next) => {
    checkRequiredFields(req.query, ['user_id']);

    return next();
  },
};
