import { checkRequiredFields } from 'utils/validator';

export default {
  like: (req, res, next) => {
    checkRequiredFields(req.query, ['id']);
    return next();
  },
};
