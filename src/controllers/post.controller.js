/* eslint-disable camelcase */
import Post from 'models/Post';
import Image from 'models/Image';
import Video from 'models/Video';
import { uploadImage, uploadVideo } from 'utils/firebase';
import { InvalidParamsValueError, BannedPostError } from 'common/errors';
import Like from 'models/Like';
import Comment from 'models/Comment';
import User from 'models/User';
import Report from 'models/Report';

export default {
  addPost: async ({
    userId, described, status, image, video,
  }) => {
    const resCreateQuery = await Post.create({
      user_id: userId,
      described,
      status,
    });
    const postId = resCreateQuery.dataValues.id;
    if (image) {
      const { fileUrl } = await uploadImage(image);
      await Image.create({
        post_id: postId,
        url: fileUrl,
      });
    } else if (video) {
      const { fileUrl, thumbUrl } = await uploadVideo(video);
      await Video.create({
        post_id: postId,
        url: fileUrl,
        thumb: thumbUrl,
      });
    }
    const url = `http://localhost:8000/it4788?user_id=${userId}&post_id=${postId}`;
    return {
      id: postId,
      url,
    };
  },
  deletePost: async ({ postId }) => {
    const post = await Post.findOne({ where: { id: postId } });

    if (!post) throw new InvalidParamsValueError();
    if (post.banned) throw new BannedPostError();
    await Post.destroy({ where: { id: postId } });
  },
  getPost: async ({ postId }) => {
    const post = await Post.findOne({ where: { id: postId } });
    if (!post) throw new InvalidParamsValueError();

    const image = await Image.findOne({ where: { post_id: post.id } });
    const video = await Video.findOne({ where: { post_id: post.id } });

    const likeCountQuery = await Like.findAndCountAll({ where: { post_id: post.id } });
    const commentCountQuery = await Comment.findAndCountAll({ where: { post_id: post.id } });
    const like = likeCountQuery.count;
    const comment = commentCountQuery.count;

    const user = await User.findOne({ where: { id: post.user_id } });

    const {
      id, described, created, modified, status, banned, can_comment,
    } = post;
    return {
      id,
      described,
      created,
      modified,
      status,
      banned,
      can_comment,
      image,
      video,
      like,
      comment,
      author: {
        id: user.id,
        name: user.name,
        avatar: user.avatar_url,
      },
    };
  },
  reportPost: async ({ postId, subject, details }) => {
    const post = await Post.findOne({ where: { id: postId } });
    if (!post) throw new InvalidParamsValueError();
    if (post.banned) throw new BannedPostError();

    const user = await User.findOne({ where: { id: post.user_id } });

    await Report.create({
      post_id: postId,
      user_id: user.id,
      subject,
      details,
    });
  },
  editPost: async ({
    postId, described, status, image, video,
  }) => {
    const post = await Post.findOne({ where: { id: postId } });
    if (!post) throw new InvalidParamsValueError();

    await Post.update({ described, status }, { where: { id: postId } });
  },
};
