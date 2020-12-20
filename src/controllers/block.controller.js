import {
  InvalidMethodError,
  NoDataError,
  NotAccessError,
  NotValidatedUserError,
} from 'common/errors';
import Block from 'models/Block';
import User from 'models/User';
import { Op } from 'sequelize';
import asyncHandler from 'utils/asyncHandler';
import handleResponse from 'utils/handleResponses';

export default {
  getListBlocks: asyncHandler(async (req, res) => {
    const { userId, isBlocked } = req.credentials;
    if (isBlocked) throw new NotAccessError();

    const index = parseInt(req.query.index, 10);
    const count = parseInt(req.query.count, 10);

    const blockees = await Block.findAll({
      where: { blocker_id: userId },
      limit: count,
      offset: index,
      order: [['blockee_id', 'asc']],
    });

    if (blockees.length === 0) throw new NoDataError();

    const blockeesInfo = await Promise.all(blockees.map(({
      blockee_id: blockeeId,
    }) => User.findOne({
      where: {
        [Op.and]: [
          { id: blockeeId },
          { is_blocked: { [Op.not]: true } },
        ],
      },
      attributes: ['id', 'name', ['avatar_url', 'avatar']],
    })));

    return handleResponse(res, blockeesInfo);
  }),

  setBlock: asyncHandler(async (req, res) => {
    const { userId, isBlocked } = req.credentials;
    if (isBlocked) throw new NotAccessError();

    const { user_id: blockeeId } = req.query;
    if (String(userId) === String(blockeeId)) throw new InvalidMethodError();

    const typeValue = parseInt(req.query.type, 10);

    const blockee = await User.findOne({ where: { id: blockeeId } });
    if (!blockee || blockee.is_blocked) throw new NotValidatedUserError();

    const oldBlock = await Block.findOne({
      where: {
        [Op.or]: [
          { blocker_id: userId, blockee_id: blockeeId },
          { blockee_id: userId, blocker_id: blockeeId },
        ],
      },
    });

    if (oldBlock && typeValue) {
      await oldBlock.destroy();
    } else if (!oldBlock && !typeValue) {
      await Block.create({ blocker_id: userId, blockee_id: blockeeId });
    } else throw new InvalidMethodError();

    return handleResponse(res);
  }),
};
