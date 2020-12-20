import { checkInteger, checkRequiredFields } from 'utils/validator';

export default {
  getRequestedFriends: (req, res, next) => {
    checkRequiredFields(req.query, ['index', 'count']);

    const { index, count } = req.query;
    checkInteger(index);
    checkInteger(count);

    return next();
  },
};
