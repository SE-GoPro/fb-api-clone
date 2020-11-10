import Token from 'models/Token';
import Post from 'models/Post';

export default {
  addPost: async (token, described, status) => {
    const tokenUser = await Token.findOne({ where: { token } });
    const resCreateQuery = await Post.create({
      user_id: tokenUser.user_id,
      described,
      status,
    });
    const postId = resCreateQuery.dataValues.id;
    const url = `http://localhost:8000/it4788?user_id=${tokenUser.user_id}&post_id=${postId}`;
    return {
      id: postId,
      url,
    };
  },
};
