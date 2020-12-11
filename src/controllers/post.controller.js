import asyncHandler from 'utils/asyncHandler';
import handleResponse from 'utils/handleResponses';
import Post from 'models/Post';
import User from 'models/User';
import Image from 'models/Image';
import Video from 'models/Video';
import { uploadImage, uploadVideo } from 'utils/firebase';
import {
  InvalidParamsValueError,
  BannedPostError,
  ExceededImageNumberError,
  ExceededVideoNumberError,
  ExceptionError,
  NotExistedPost,
} from 'common/errors';
import constants from 'common/constants';
import Like from 'models/Like';
import Comment from 'models/Comment';
import Report from 'models/Report';
import sequelize from 'utils/sequelize';
import { getUNIXSeconds } from 'utils/commonUtils';
import Block from 'models/Block';

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
      } else {
        if (video.length > constants.MAX_VIDEO_NUMBER) throw new ExceededVideoNumberError();
        if (video[0]) {
          const uploadedVideo = await uploadVideo(video[0]);
          newVideo = uploadedVideo;
        }
      }
    }

    await sequelize.transaction(async t => {
      const newPost = await Post.create(postData, { transaction: t });
      postId = newPost.id;
      if (newImages) {
        await Image.bulkCreate(
          newImages.map(({ fileUrl }) => ({ post_id: postId, url: fileUrl })),
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
    const { userId } = req.credentials || { userId: null };
    const post = await Post.findOne({ where: { id } });
    if (!post) throw new InvalidParamsValueError();

    if (post.banned) throw new NotExistedPost();

    const [image, video, like, comment, user, block] = await Promise.all([
      Image.findAll({ where: { post_id: id }, attributes: ['id', 'url'] }),
      Video.findOne({ where: { post_id: id }, attributes: ['url', 'thumb'] }),
      Like.findAndCountAll({ where: { post_id: id } }),
      Comment.count({ where: { post_id: id } }),
      User.findOne({ where: { id: post.user_id } }),
      Block.findOne({ where: { blocker_id: post.user_id, blockee_id: userId } }),
    ]);

    const {
      id: postId, described, created, modified, status, banned, can_comment: canComment,
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
        id: user?.id,
        name: user?.name,
        avatar: user?.avatar_url,
      },
      status,
      is_blocked: block ? '1' : '0',
      banned: banned ? '1' : '0',
      can_comment: isGetPublicPost ? null : canPostComment,
    });
  }),
  deletePost: asyncHandler(async (req, res) => {
    const { id } = req.query;
    const post = await Post.findOne({ where: { id } });

    if (!post) throw new InvalidParamsValueError();
    if (post.banned) throw new BannedPostError();
    await Post.destroy({ where: { id } });

    return handleResponse(res);
  }),
  reportPost: asyncHandler(async (req, res) => {
    const { id, subject, details } = req.query;
    const post = await Post.findOne({ where: { id } });
    if (!post) throw new InvalidParamsValueError();
    if (post.banned) throw new BannedPostError();

    const user = await User.findOne({ where: { id: post.user_id } });

    await Report.create({
      post_id: id,
      user_id: user.id,
      subject,
      details,
    });

    return handleResponse(res);
  }),
  editPost: asyncHandler(async (req, res) => {
    const { id, described, status } = req.query;
    const post = await Post.findOne({ where: { id } });
    if (!post) throw new InvalidParamsValueError();

    await Post.update({ described, status }, { where: { id } });

    return handleResponse(res);
  }),
};
