import { checkRequiredFields, checkInteger, checkBit } from 'utils/validator';

export default {
  getListBlocks: (req, res, next) => {
    checkRequiredFields(req.query, ['index', 'count']);

    const { index, count } = req.query;
    checkInteger(index);
    checkInteger(count);

    return next();
  },

  setBlock: (req, res, next) => {
    checkRequiredFields(req.query, ['user_id', 'type']);
    checkBit(req.query.type);

    return next();
  },
};
