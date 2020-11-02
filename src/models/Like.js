import Post from 'models/Post';
import User from 'models/User';
import { DataTypes } from 'sequelize';
import sequelize from 'utils/sequelize';

const Like = sequelize.define('Like', {
  user_id: DataTypes.BIGINT,
  post_id: DataTypes.BIGINT,
}, {
  tableName: 'likes',
  timestamps: false,
});

Like.belongsTo(User, { foreignKey: 'user_id' });
Like.belongsTo(Post, { foreignKey: 'post_id' });

export default Like;
