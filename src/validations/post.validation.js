import { checkRequiredFields } from 'utils/validator';

export default {
  getPost: (req, res, next) => {
    checkRequiredFields(req.query, ['id']);
    return next();
  },

  editPost: (req, res, next) => {
    checkRequiredFields(req.query, ['id']);
    return next();
  },
};
