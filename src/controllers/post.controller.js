import Post from 'models/Post';
import Image from 'models/Image';
import Video from 'models/Video';
import { uploadImage, uploadVideo } from 'utils/firebase';

export default {
  addPost: async ({
    tokenData,
    described,
    status,
    image,
    video,
  }) => {
    const resCreateQuery = await Post.create({
      user_id: tokenData.user_id,
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
    const url = `http://localhost:8000/it4788?user_id=${tokenData.user_id}&post_id=${postId}`;
    return {
      id: postId,
      url,
    };
  },
};
