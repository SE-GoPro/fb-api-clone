import User from 'models/User';
import { DataTypes } from 'sequelize';
import sequelize from 'utils/sequelize';

const Post = sequelize.define('Post', {
  user_id: DataTypes.BIGINT,
  described: DataTypes.STRING,
  created: DataTypes.DATE,
  emotion: DataTypes.STRING,
  modified: DataTypes.DATE,
  state: DataTypes.STRING,
  banned: DataTypes.STRING,
  can_comment: DataTypes.BOOLEAN,
}, {
  tableName: 'posts',
  timestamps: false,
});

Post.belongsTo(User, { foreignKey: 'user_id' });

export default Post;
