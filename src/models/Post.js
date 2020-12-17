import User from 'models/User';
import { DataTypes, QueryTypes } from 'sequelize';
import sequelize from 'utils/sequelize';

const Post = sequelize.define('Post', {
  user_id: DataTypes.BIGINT,
  described: DataTypes.STRING,
  created: DataTypes.DATE,
  modified: DataTypes.DATE,
  status: DataTypes.STRING,
  banned: DataTypes.STRING,
  can_comment: DataTypes.BOOLEAN,
  category_id: DataTypes.INTEGER,
}, {
  tableName: 'posts',
  timestamps: false,
});

Post.belongsTo(User, { foreignKey: 'user_id' });

Post.fuzzySearch = ({ keyword, index, count }) => sequelize.query(
  `SELECT posts.id, described, posts.user_id, videos.url as video_url, videos.thumb as video_thumb
  FROM posts
  LEFT JOIN videos
  ON posts.id = videos.post_id
  WHERE :keyword % ANY(STRING_TO_ARRAY(posts.described, ' '))
  LIMIT :count
  OFFSET :index`,
  {
    type: QueryTypes.SELECT,
    replacements: { keyword, index: index > 0 ? index : 0, count: count > 0 ? count : 0 },
  },
);

export default Post;
