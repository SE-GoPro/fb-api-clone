import { AlreadyDoneActionError, NotAccessError, NotExistedPostError } from 'common/errors';
import Like from 'models/Like';
import Post from 'models/Post';
import asyncHandler from 'utils/asyncHandler';
import handleResponse from 'utils/handleResponses';

export default {
  like: asyncHandler(async (req, res) => {
    const { id } = req.query;
    const { userId, isBlocked } = req.credentials;
    if (isBlocked) throw new NotAccessError();

    const post = await Post.findOne({ where: { id } });
    if (!post) throw new NotExistedPostError();
    if (post.banned) throw new AlreadyDoneActionError();

    const currentPostLikes = await Like.findAll({ where: { post_id: id } });
    let totalLikes = currentPostLikes.filter(like => !like.unlike).length;

    const userLike = currentPostLikes
      .find(likes => likes.user_id === userId);

    if (userLike) {
      await Like.update(
        { unlike: !userLike.unlike },
        { where: { post_id: id, user_id: userId } },
      );
      totalLikes += (userLike.unlike ? 1 : -1);
    } else {
      await Like.create({ user_id: userId, post_id: id, unlike: false });
      totalLikes += 1;
    }

    return handleResponse(res, { like: String(totalLikes) });
  }),
};
