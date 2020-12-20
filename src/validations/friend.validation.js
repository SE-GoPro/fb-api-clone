import { checkBit, checkInteger, checkRequiredFields } from 'utils/validator';

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
    checkBit(req.query.is_accept);

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
