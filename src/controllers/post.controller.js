import asyncHandler from 'utils/asyncHandler';
import handleResponse from 'utils/handleResponses';
import Post from 'models/Post';
import User from 'models/User';
import Image from 'models/Image';
import Video from 'models/Video';
import { uploadImage, uploadVideo } from 'utils/firebase';
import {
  InvalidParamsValueError,
  ExceededImageNumberError,
  ExceptionError,
  NotExistedPostError,
  NotValidatedUserError,
  NotAccessError,
  AlreadyDoneActionError,
  UploadFailedError,
  NoDataError,
} from 'common/errors';
import constants from 'common/constants';
import Like from 'models/Like';
import Comment from 'models/Comment';
import Report from 'models/Report';
import sequelize from 'utils/sequelize';
import { getUNIXSeconds } from 'utils/commonUtils';
import Block from 'models/Block';
import { Op } from 'sequelize';

export default {
  addPost: asyncHandler(async (req, res) => {
    const { userId } = req.credentials;
    const { described, status } = req.query;

    if (!described && !req.files) throw InvalidParamsValueError();

    let postId = null;
    let newImages;
    let newVideo;
    const postData = {
      user_id: userId,
      described: described || null,
      status: status || null,
    };

    if (req.files) {
      const { image, video } = req.files;
      if (image && video) throw new InvalidParamsValueError();
      if (image) {
        if (image.length > constants.MAX_IMAGE_NUMBER) throw new ExceededImageNumberError();
        newImages = await Promise.all(image.map(file => uploadImage(file)));
      } else if (video) {
        if (video.length !== constants.MAX_VIDEO_NUMBER) throw new UploadFailedError();
        newVideo = await uploadVideo(video[0]);
      }
    }

    await sequelize.transaction(async t => {
      const newPost = await Post.create({
        ...postData,
        category_id: newVideo ? constants.Categories.VIDEO : null,
      }, { transaction: t });
      postId = newPost.id;
      if (newImages) {
        await Image.bulkCreate(
          newImages.map(({ fileUrl }, index) => ({ post_id: postId, url: fileUrl, index })),
          { transaction: t },
        );
      }

      if (newVideo) {
        await Video.create(
          { post_id: postId, url: newVideo.fileUrl, thumb: newVideo.thumbUrl },
          { transaction: t },
        );
      }
    });

    if (!postId) throw new ExceptionError();

    return handleResponse(res, {
      id: postId,
      url: null,
    });
  }),

  getPost: asyncHandler(async (req, res) => {
    const { id } = req.query;
    const { userId, isBlocked } = req.credentials || { userId: null, isBlocked: false };
    if (userId && isBlocked) throw new NotAccessError();

    const post = await Post.findOne({
      where: { id },
      include: {
        model: User,
        attributes: ['id', 'name', 'avatar_url'],
        required: false,
      },
    });
    if (!post || post.banned) throw new NotExistedPostError();

    const [image, video, like, comment, block] = await Promise.all([
      Image.findAll({ where: { post_id: id }, attributes: ['id', 'url'], order: [['index', 'asc']] }),
      Video.findOne({ where: { post_id: id }, attributes: ['url', 'thumb'] }),
      Like.findAndCountAll({ where: { post_id: id } }),
      Comment.count({ where: { post_id: id } }),
      userId && !isBlocked
        ? Block.findOne({ where: { blocker_id: post.user_id, blockee_id: userId } })
        : Promise.resolve(null),
    ]);

    if (block) throw new NotExistedPostError();

    const {
      id: postId,
      described,
      created,
      modified,
      status,
      banned,
      can_comment: canComment,
      User: { id: authorId, name, avatar_url: avatar },
    } = post;

    const isGetPublicPost = !userId;
    let isLike = '0';
    let canPostComment = null;
    if (userId) {
      isLike = like.rows.find(({ user_id: id }) => id === userId) ? '1' : '0';
      canPostComment = canComment ? '1' : '0';
    }

    return handleResponse(res, {
      id: postId,
      described,
      created: getUNIXSeconds(created),
      modified: getUNIXSeconds(modified),
      like: String(like.count),
      comment: String(comment),
      is_like: isGetPublicPost ? null : isLike,
      image: image.length > 0 ? image : null,
      video: video || null,
      author: {
        id: authorId,
        name,
        avatar,
      },
      status,
      is_blocked: block ? '1' : '0',
      banned: banned ? '1' : '0',
      can_comment: isGetPublicPost ? null : canPostComment,
    });
  }),

  editPost: asyncHandler(async (req, res) => {
    const {
      id, described, status, image_del: imageDel, image_sort: imageSort,
    } = req.query;

    const { isBlocked } = req.credentials || { isBlocked: false };
    if (isBlocked) throw new NotValidatedUserError();

    const post = await Post.findOne({ where: { id } });
    if (!post) throw new NotExistedPostError();

    let isUpdated = false;

    if (described || status) {
      const postData = { modified: Date.now() };
      ['described', 'status'].forEach(field => {
        if (req.query[field]) postData[field] = req.query[field];
      });

      await Post.update(postData, { where: { id } });
      isUpdated = true;
    }

    const [currentPostImages, currentPostVideo] = await Promise.all([
      Image.findAndCountAll({ where: { post_id: id } }),
      Video.findOne({ where: { post_id: id } }),
    ]);

    const deleteImagesCount = imageDel
      ? currentPostImages.rows.filter(({ id }) => imageDel.includes(id))
      : 0;

    if (imageDel) {
      if (imageDel.some(id => parseInt(id, 10) < 0)) {
        throw new InvalidParamsValueError();
      }
      await Image.destroy({ where: { id: { [Op.in]: imageDel } } });
      isUpdated = true;
    }

    if (req.files) {
      const { image, video, thumb } = req.files;
      if (image && video) throw new InvalidParamsValueError();

      if (image) {
        if (currentPostVideo) throw new InvalidParamsValueError();
        const totalImages = currentPostImages.count + image.length - deleteImagesCount;
        const sortedImages = currentPostImages.rows.sort((a, b) => a.index - b.index);

        if (totalImages >= constants.MAX_IMAGE_NUMBER) {
          throw new ExceededImageNumberError();
        }

        const insertIndex = Number.isNaN(parseInt(imageSort, 10)) ? 0 : parseInt(imageSort, 10);
        if (currentPostImages.count < insertIndex || insertIndex < 0) {
          throw new InvalidParamsValueError();
        }

        const newImages = await Promise.all(image.map(file => uploadImage(file)));
        await sequelize.transaction(async t => {
          const newSavedImages = await Image.bulkCreate(
            newImages.map(({ fileUrl }, index) => ({
              post_id: id, url: fileUrl, index: insertIndex + index,
            })),
            { transaction: t, returning: ['id', 'url', 'index'] },
          );

          const newPostImages = sortedImages
            .slice(0, insertIndex)
            .concat(newSavedImages.map(({ id }) => ({ id })))
            .concat(sortedImages.slice(insertIndex))
            .filter(({ id }) => !(imageDel || []).includes(id));

          await Promise.all(newPostImages.map(
            ({ id }, index) => Image.update({ index }, { where: { id }, transaction: t }),
          ));
        });
        isUpdated = true;
      } else if (video) {
        if (currentPostImages.count > deleteImagesCount
          || video.length !== constants.MAX_VIDEO_NUMBER
          || currentPostVideo
        ) throw new InvalidParamsValueError();
        const newVideo = await uploadVideo(video[0]);
        let { thumbUrl } = newVideo;
        if (thumb) {
          const newThumb = await uploadImage(thumb[0]);
          thumbUrl = newThumb.fileUrl;
        }

        await Video.create({ url: newVideo.fileUrl, thumb: thumbUrl });
        isUpdated = true;
      }
    }

    if (!isUpdated) throw new InvalidParamsValueError();

    return handleResponse(res, { id });
  }),

  deletePost: asyncHandler(async (req, res) => {
    const { id } = req.query;
    const { userId, isBlocked } = req.credentials;
    if (isBlocked) throw new NotAccessError();

    const post = await Post.findOne({ where: { id } });
    if (!post || post.banned) throw new NotExistedPostError();
    if (post.user_id !== userId) throw new NotAccessError();

    await Post.destroy({ where: { id } });

    return handleResponse(res);
  }),

  reportPost: asyncHandler(async (req, res) => {
    const { id, subject, details } = req.query;
    const { userId, isBlocked } = req.credentials;
    if (isBlocked) throw new NotAccessError();

    const post = await Post.findOne({ where: { id } });
    if (!post) throw new NotExistedPostError();
    if (post.banned) throw new AlreadyDoneActionError();

    await Report.create({
      post_id: id,
      user_id: userId,
      subject,
      details,
    });

    return handleResponse(res);
  }),

  getListPosts: asyncHandler(async (req, res) => {
    const lastId = req.query.last_id ? parseInt(req.query.last_id, 10) : 0;
    const index = parseInt(req.query.index, 10);
    const count = parseInt(req.query.count, 10);
    const { userId, isBlocked } = req.credentials || { userId: null, isBlocked: false };
    if (userId && isBlocked) throw new NotAccessError();

    let blockIdLists = [];
    if (userId && !isBlocked) {
      const blockLists = await Block.findAll({
        where: {
          [Op.or]: [
            { blocker_id: userId },
            { blockee_id: userId },
          ],
        },
        attributes: ['blocker_id', 'blockee_id'],
      });
      blockIdLists = (blockLists || []).map(({
        blocker_id: blockerId, blockee_id: blockeeId,
      }) => (blockerId === userId ? blockeeId : blockerId));
    }

    const getPostConditions = {
      user_id: { [Op.notIn]: blockIdLists },
    };
    if (lastId !== 0) Object.assign(getPostConditions, { id: { [Op.lte]: lastId } });

    const posts = await Post.findAll({
      where: getPostConditions,
      limit: count,
      offset: index,
      include: {
        model: User,
        attributes: ['id', 'name', 'avatar_url'],
        required: false,
      },
      order: [['created', 'desc']],
    });

    if (posts.length === 0) throw new NoDataError();

    const postIds = posts.map(({ id }) => id);
    const newPostsCount = lastId ? await Post.count({ where: { id: { [Op.gt]: lastId } } }) : 0;

    const [images, videos, likes, comments] = await Promise.all([
      Image.findAll({ where: { post_id: { [Op.in]: postIds } } }),
      Video.findAll({ where: { post_id: { [Op.in]: postIds } } }),
      Like.findAll({ where: { post_id: { [Op.in]: postIds } } }),
      Comment.findAll({ where: { post_id: { [Op.in]: postIds } } }),
    ]);

    return handleResponse(res, {
      posts: posts.map(post => {
        const publicPost = !userId;
        const postImages = images.filter(image => image.post_id === post.id).map(({ url }) => url);
        const postVideo = videos.find(video => video.post_id === post.id);
        const postLikes = likes.filter(like => like.post_id === post.id);
        const postComments = comments.filter(comment => comment.post_id === post.id);
        const userLikes = userId ? postLikes.filter(like => like.user_id === userId) : null;
        const postCanComment = post.can_comment ? '1' : '0';
        const postCanEdit = !publicPost && post.user_id === userId ? '1' : '0';

        return {
          id: post.id,
          image: postImages.length === 0 ? null : postImages,
          video: postVideo ? { url: postVideo.url, thumb: postVideo.thumb } : null,
          described: post.described,
          created: getUNIXSeconds(post.created),
          like: String(postLikes.length),
          comment: String(postComments.length),
          is_liked: userLikes ? String(userLikes.length) : null,
          // is_blocked: ,
          can_comment: publicPost ? null : postCanComment,
          can_edit: postCanEdit,
          banned: post.banned ? '1' : '0',
          status: post.status,
          author: {
            id: post.User.id,
            username: post.User.name,
            avatar: post.User.avatar_url,
          },
        };
      }),
      new_items: String(newPostsCount),
      last_id: String(lastId || posts[0].id),
    });
  }),

  checkNewItem: asyncHandler(async (req, res) => {
    const lastId = parseInt(req.query.last_id, 10);
    const categoryId = req.query.category_id ? parseInt(req.query.category_id, 10) : 0;

    const conditions = {
      id: {
        [Op.gt]: lastId,
      },
    };
    if (categoryId !== 0) Object.assign(conditions, { category_id: categoryId });

    const countNewItems = await Post.count({ where: conditions });

    return handleResponse(res, { new_items: String(countNewItems) });
  }),

  getListVideos: asyncHandler(async (req, res) => {
    const lastId = req.query.last_id ? parseInt(req.query.last_id, 10) : 0;
    const index = parseInt(req.query.index, 10);
    const count = parseInt(req.query.count, 10);
    const { userId, isBlocked } = req.credentials || { userId: null, isBlocked: false };
    if (userId && isBlocked) throw new NotAccessError();

    let blockIdLists = [];
    if (userId && !isBlocked) {
      const blockLists = await Block.findAll({
        where: {
          [Op.or]: [
            { blocker_id: userId },
            { blockee_id: userId },
          ],
        },
        attributes: ['blocker_id', 'blockee_id'],
      });
      blockIdLists = (blockLists || []).map(({
        blocker_id: blockerId, blockee_id: blockeeId,
      }) => (blockerId === userId ? blockeeId : blockerId));
    }

    const getPostConditions = {
      user_id: { [Op.notIn]: blockIdLists },
      category_id: constants.Categories.VIDEO,
    };
    if (lastId !== 0) Object.assign(getPostConditions, { id: { [Op.lte]: lastId } });

    const posts = await Post.findAll({
      where: getPostConditions,
      limit: count,
      offset: index,
      include: {
        model: User,
        attributes: ['id', 'name', 'avatar_url'],
        required: false,
      },
      order: [['created', 'desc']],
    });

    if (posts.length === 0) throw new NoDataError();

    const postIds = posts.map(({ id }) => id);
    const newPostsCount = lastId ? await Post.count({
      where: {
        id: { [Op.gt]: lastId },
        category_id: constants.Categories.VIDEO,
      },
    }) : 0;

    const [videos, likes, comments] = await Promise.all([
      Video.findAll({ where: { post_id: { [Op.in]: postIds } } }),
      Like.findAll({ where: { post_id: { [Op.in]: postIds } } }),
      Comment.findAll({ where: { post_id: { [Op.in]: postIds } } }),
    ]);

    return handleResponse(res, {
      post: posts.map(post => {
        const publicPost = !userId;
        const postVideo = videos.find(video => video.post_id === post.id);
        const postLikes = likes.filter(like => like.post_id === post.id);
        const postComments = comments.filter(comment => comment.post_id === post.id);
        const userLikes = userId ? postLikes.filter(like => like.user_id === userId) : null;
        const postCanComment = post.can_comment ? '1' : '0';
        const postCanEdit = !publicPost && post.user_id === userId ? '1' : '0';

        return {
          id: post.id,
          video: { url: postVideo.url, thumb: postVideo.thumb },
          described: post.described,
          created: getUNIXSeconds(post.created),
          like: String(postLikes.length),
          comment: String(postComments.length),
          is_liked: userLikes ? String(userLikes.length) : null,
          // is_blocked: ,
          can_comment: publicPost ? null : postCanComment,
          can_edit: postCanEdit,
          banned: post.banned ? '1' : '0',
          status: post.status,
          author: {
            id: post.User.id,
            username: post.User.name,
            avatar: post.User.avatar_url,
          },
        };
      }),
      new_items: String(newPostsCount),
      last_id: String(lastId || posts[0].id),
    });
  }),
};
