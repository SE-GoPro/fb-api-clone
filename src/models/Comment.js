import Post from 'models/Post';
import User from 'models/User';
import { DataTypes } from 'sequelize';
import sequelize from 'utils/sequelize';

const Comment = sequelize.define('Comment', {
  user_id: DataTypes.BIGINT,
  post_id: DataTypes.BIGINT,
  comment: DataTypes.STRING,
  created: DataTypes.DATE,
  is_blocked: DataTypes.BOOLEAN,
}, {
  tableName: 'comments',
  timestamps: false,
});

Comment.belongsTo(User, { foreignKey: 'user_id' });
Comment.belongsTo(Post, { foreignKey: 'post_id' });

export default Comment;
