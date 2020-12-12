import constants from 'common/constants';

import asyncHandler from 'utils/asyncHandler';
import Post from 'models/Post';
import Image from 'models/Image';
import Search from 'models/Search';
import Like from 'models/Like';
import Comment from 'models/Comment';
import User from 'models/User';
import { getTimeField } from 'utils/sequelize';
import { Op } from 'sequelize';
import { NoDataError } from 'common/errors';
import handleResponse from 'utils/handleResponses';

const {
  HASH_TAG_MARK,
  MAX_KEY_WORD_COUNT,
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
    is_like: isLike,
    like,
    comment,
  };

  if (listImageUrls) Object.assign(transformedData, { image: listImageUrls });
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
    const { keyword, index, count } = req.query;
    const { userId } = req.credentials;
    const startId = parseInt(index, 10);
    if (!keyword.startsWith(HASH_TAG_MARK)) {
      const oldSearch = await Search.findOne({ where: { keyword: keyword.toLowerCase() } });
      if (oldSearch) {
        await Search.update({ created: Date.now() });
      } else {
        await Search.create({ user_id: userId, keyword: keyword.toLowerCase() });
      }
    }
    const listPosts = await Post.fuzzySearch({
      keyword,
      startId,
      count: parseInt(count, 10),
    });

    const transformedPostsList = await Promise.all(listPosts.map(async ({
      id,
      described,
      user_id: authorId,
      video_url: videoUrl,
      video_thumb: videoThumb,
    }) => {
      const listImageUrls = await Image.findAll({ where: { post_id: id }, attributes: ['url'] });
      const postLikes = await Like.findAll({ where: { post_id: id }, attributes: ['user_id'] });
      const postCommentCounts = await Comment.count({ where: { post_id: id } });
      const { name: authorName, avatar_url: authorAvatar } = await User.findOne({ where: { id: authorId }, attributes: ['name', 'avatar_url'] });
      return searchResultTransform({
        id,
        described,
        videoUrl,
        videoThumb,
        listImageUrls,
        like: postLikes.length,
        comment: postCommentCounts,
        isLike: !!postLikes.find(postLike => postLike.user_id === userId),
        authorId,
        authorName,
        authorAvatar,
      });
    }));

    return handleResponse(res, transformedPostsList);
  }),

  getSavedSearch: asyncHandler(async (req, res) => {
    const { index, count } = req.query;
    const { userId } = req.credentials;

    const limit = parseInt(count, 10);
    const listKeywords = await Search.findAll({
      where: { user_id: userId, id: { [Op.gte]: parseInt(index, 10) } },
      attributes: ['id', 'keyword', getTimeField('created')],
      order: [['created', 'DESC']],
      limit: limit <= MAX_KEY_WORD_COUNT ? limit : MAX_KEY_WORD_COUNT,
    });

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
