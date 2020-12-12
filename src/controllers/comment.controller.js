import {
  AlreadyDoneActionError, InvalidParamsValueError, NoDataError, NotAccessError, NotExistedPostError,
} from 'common/errors';
import Block from 'models/Block';
import Comment from 'models/Comment';
import Post from 'models/Post';
import User from 'models/User';
import { Op } from 'sequelize';
import asyncHandler from 'utils/asyncHandler';
import handleResponse from 'utils/handleResponses';
import sequelize, { getTimeField } from 'utils/sequelize';

async function getCommentsList(id, count, index, userId) {
  const comments = await Comment.findAll({
    where: { post_id: id },
    attributes: ['id', 'comment', getTimeField('created'), 'user_id'],
    order: [['created', 'DESC']],
    limit: count,
    offset: index,
  });

  let blockIds = [];
  if (userId) {
    const blockLists = await Block.findAll({
      where: {
        [Op.or]: [
          { blocker_id: userId },
          { blockee_id: userId },
        ],
      },
      attributes: ['blocker_id', 'blockee_id'],
    });
    blockIds = blockLists.map(({
      blocker_id: blockerId, blockee_id: blockeeId,
    }) => (blockerId === userId ? blockeeId : blockerId));
  }

  const commentWithPosters = await Promise.all(
    comments
      .map(async ({ user_id: userId, ...comment }) => {
        if (blockIds.includes(userId)) return null;
        const poster = await User.findOne({ where: { id: userId }, attributes: ['id', 'name', sequelize.literal('avatar_url as avatar')] });

        return { poster, ...comment };
      })
      .filter(comment => comment),
  );
  return commentWithPosters;
}

export default {
  getComment: asyncHandler(async (req, res) => {
    const { id } = req.query;
    const index = parseInt(req.query.index, 10);
    const count = parseInt(req.query.count, 10);

    const { userId, isBlocked } = req.credentials || { userId: null, isBlocked: false };
    if (isBlocked) throw new NotAccessError();

    const post = await Post.findOne({ where: { id } });
    if (!post) throw new NotExistedPostError();
    if (post.banned) throw new AlreadyDoneActionError();

    const commentWithPosters = await getCommentsList(id, count, index, userId);

    if (commentWithPosters.length === 0) throw new NoDataError();

    return handleResponse(res, commentWithPosters);
  }),

  setComment: asyncHandler(async (req, res) => {
    const { id, comment } = req.query;
    const index = parseInt(req.query.index, 10);
    const count = parseInt(req.query.count, 10);

    const { userId, isBlocked } = req.credentials;
    if (isBlocked) throw new NotAccessError();

    if (!comment || String(comment).length === 0) throw new InvalidParamsValueError();

    const post = await Post.findOne({ where: { id } });
    if (!post) throw new NotExistedPostError();
    if (post.banned) throw new AlreadyDoneActionError();

    await Comment.create({
      user_id: userId,
      post_id: id,
      comment,
    });

    const commentWithPosters = await getCommentsList(id, count, index, userId);

    if (commentWithPosters.length === 0) throw new NoDataError();

    return handleResponse(res, commentWithPosters);
  }),
};
