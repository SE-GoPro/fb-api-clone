import constants from 'common/constants';

import asyncHandler from 'utils/asyncHandler';
import Post from 'models/Post';
import Image from 'models/Image';
import Search from 'models/Search';
import Like from 'models/Like';
import Comment from 'models/Comment';
import User from 'models/User';
import { NoDataError, NotAccessError } from 'common/errors';
import handleResponse from 'utils/handleResponses';
import { getUNIXSeconds } from 'utils/commonUtils';

const {
  HASH_TAG_MARK,
} = constants;

function searchResultTransform({
  id,
  described,
  videoUrl,
  videoThumb,
  listImageUrls,
  like,
  comment,
  isLike,
  authorId,
  authorName,
  authorAvatar,
}) {
  const transformedData = {
    id,
    described,
    is_like: isLike ? '1' : '0',
    like: String(like),
    comment: String(comment),
  };

  Object.assign(transformedData, { image: listImageUrls });
  Object.assign(transformedData, { video: videoUrl ? { url: videoUrl, thumb: videoThumb } : null });
  Object.assign(transformedData, {
    author: {
      id: authorId, name: authorName, avatar: authorAvatar,
    },
  });
  return transformedData;
}

export default {
  search: asyncHandler(async (req, res) => {
    const { keyword } = req.query;
    const { userId, isBlocked } = req.credentials;
    const index = parseInt(req.query.index, 10);
    const count = parseInt(req.query.count, 10);

    if (isBlocked) throw new NotAccessError();

    if (!keyword.startsWith(HASH_TAG_MARK)) {
      const oldSearch = await Search.findOne({ where: { keyword: keyword.toLowerCase() } });
      if (oldSearch) {
        await Search.update({ created: Date.now() }, { where: { id: oldSearch.id } });
      } else {
        await Search.create({ user_id: userId, keyword: keyword.toLowerCase() });
      }
    }
    const listPosts = await Post.fuzzySearch({
      keyword,
      index,
      count,
    });

    const transformedPostsList = await Promise.all(listPosts.map(async ({
      id,
      described,
      user_id: authorId,
      video_url: videoUrl,
      video_thumb: videoThumb,
    }) => {
      const [
        listImageUrls, postLikes, postCommentCounts, { name: authorName, avatar_url: authorAvatar },
      ] = await Promise.all([
        Image.findAll({ where: { post_id: id }, attributes: ['id', 'url'], order: [['index', 'asc']] }),
        Like.findAll({ where: { post_id: id, unlike: false }, attributes: ['user_id'] }),
        Comment.count({ where: { post_id: id } }),
        User.findOne({ where: { id: authorId }, attributes: ['name', 'avatar_url'] }),
      ]);
      return searchResultTransform({
        id,
        described,
        videoUrl,
        videoThumb,
        listImageUrls: listImageUrls.length > 0 ? listImageUrls : null,
        like: postLikes.length,
        comment: postCommentCounts,
        isLike: !!postLikes.find(postLike => postLike.user_id === userId),
        authorId,
        authorName,
        authorAvatar,
      });
    }));

    if (transformedPostsList.length === 0) throw new NoDataError();

    return handleResponse(res, transformedPostsList);
  }),

  getSavedSearch: asyncHandler(async (req, res) => {
    const { index, count } = req.query;
    const { userId, isBlocked } = req.credentials;

    if (isBlocked) throw new NotAccessError();

    const offset = parseInt(index, 10);
    const limit = parseInt(count, 10);
    const keywords = await Search.findAll({
      where: { user_id: userId },
      attributes: ['id', 'keyword', 'created'],
      order: [['created', 'DESC']],
      offset,
      limit,
    });

    if (keywords.length === 0) throw new NoDataError();

    const listKeywords = keywords.map(({
      id, keyword, created,
    }) => ({ id, keyword, created: getUNIXSeconds(created) }));

    return handleResponse(res, listKeywords);
  }),

  delSavedSearch: asyncHandler(async (req, res) => {
    const { search_id: searchId, all } = req.query;
    const { userId } = req.credentials;

    const delConditions = { user_id: userId };
    if (parseInt(all, 10) === 1) {
      const listKeywords = await Search.findAll({ where: { user_id: userId } });
      if (listKeywords.length === 0) throw new NoDataError();
    } else {
      delConditions.id = searchId;
    }
    await Search.destroy({
      where: delConditions,
    });
    return handleResponse(res);
  }),
};
