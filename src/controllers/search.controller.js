import constants from 'common/constants';

import Post from 'models/Post';
import Image from 'models/Image';
import Search from 'models/Search';
import Like from 'models/Like';
import Comment from 'models/Comment';
import User from 'models/User';
import { getTimeField } from 'utils/sequelize';
import { Op } from 'sequelize';
import { NoDataError } from 'common/errors';

const {
  HASH_TAG_MARK,
  MAX_SEARCH_COUNT,
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
  const transformeData = {
    id,
    described,
    is_like: isLike,
    like,
    comment,
  };

  if (listImageUrls) Object.assign(transformeData, { image: listImageUrls });
  Object.assign(transformeData, { video: videoUrl ? { url: videoUrl, thumb: videoThumb } : null });
  Object.assign(transformeData, {
    author: {
      id: authorId, name: authorName, avatar: authorAvatar,
    },
  });
  return transformeData;
}

export default {
  search: async ({
    userId,
    keyword,
    index,
    count,
  }) => {
    const startId = parseInt(index, 10);
    if (!keyword.startsWith(HASH_TAG_MARK)) {
      await Search.upsertKeyword({
        userId,
        keyword,
      });
    }
    const limit = parseInt(count, 10);
    const listPosts = await Post.fuzzySearch({
      keyword,
      startId,
      count: limit <= MAX_SEARCH_COUNT ? limit : MAX_SEARCH_COUNT,
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

    return transformedPostsList;
  },

  getSavedSearch: async ({
    userId,
    index,
    count,
  }) => {
    const limit = parseInt(count, 10);
    const listKeywords = await Search.findAll({
      where: { user_id: userId, id: { [Op.gte]: parseInt(index, 10) } },
      attributes: ['id', 'keyword', getTimeField('created')],
      order: [['created', 'DESC']],
      limit: limit <= MAX_KEY_WORD_COUNT ? limit : MAX_KEY_WORD_COUNT,
    });

    return listKeywords;
  },

  delSavedSearch: async ({
    userId,
    searchId,
    all,
  }) => {
    const delConditions = { user_id: userId };
    if (parseInt(all, 10) === 1) {
      const listKeywords = await Search.findAll({ where: { user_id: userId } });
      if (listKeywords.length === 0) throw new NoDataError();
    } else {
      delConditions.id = searchId;
    }
    return Search.destroy({
      where: delConditions,
    });
  },
};
