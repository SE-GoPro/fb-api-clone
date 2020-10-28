import Post from 'models/Post';
import { DataTypes } from 'sequelize';
import sequelize from 'utils/sequelize';

const Video = sequelize.define('Video', {
  post_id: DataTypes.BIGINT,
  url: DataTypes.STRING,
  thumb: DataTypes.STRING,
}, {
  tableName: 'videos',
  timestamps: false,
});

Video.belongsTo(Post, { foreignKey: 'post_id' });

export default Video;
