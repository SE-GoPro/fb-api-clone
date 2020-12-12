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

  deletePost: (req, res, next) => {
    checkRequiredFields(req.query, ['id']);
    return next();
  },

  reportPost: (req, res, next) => {
    checkRequiredFields(req.query, ['id', 'subject', 'details']);
    return next();
  },
};
