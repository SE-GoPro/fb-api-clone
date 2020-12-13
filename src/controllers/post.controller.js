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

    const postData = {
      user_id: userId,
      described: described || null,
      status: status || null,
    };

    let postId = null;
    let newImages;
    let newVideo;

    if (req.files) {
      const { image, video } = req.files;
      if (image && video) throw new InvalidParamsValueError();
      if (image) {
        if (image.length > constants.MAX_IMAGE_NUMBER) throw new ExceededImageNumberError();
        const uploadedImages = await Promise.all(image.map(file => uploadImage(file)));
        newImages = uploadedImages;
      } else if (video[0]) {
        const uploadedVideo = await uploadVideo(video[0]);
        newVideo = uploadedVideo;
      }
    }

    await sequelize.transaction(async t => {
      const newPost = await Post.create(postData, { transaction: t });
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

      if (image && !currentPostVideo) {
        const deleteImagesCount = imageDel
          ? currentPostImages.rows.filter(({ id }) => imageDel.includes(id))
          : 0;

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
      } else if (video && currentPostImages.count === 0) {
        if (video[0]) {
          const newVideo = await uploadVideo(video[0]);
          let { thumbUrl } = newVideo;
          if (thumb) {
            const newThumb = await uploadImage(thumb[0]);
            thumbUrl = newThumb.fileUrl;
          }
          if (currentPostVideo) {
            await Video.update(
              { url: newVideo.fileUrl, thumb: thumbUrl },
              { where: { post_id: id } },
            );
          } else {
            await Video.create({ url: newVideo.fileUrl, thumb: thumbUrl });
          }
          isUpdated = true;
        }
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
};
