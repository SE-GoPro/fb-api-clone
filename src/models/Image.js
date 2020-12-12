import Post from 'models/Post';
import { DataTypes } from 'sequelize';
import sequelize from 'utils/sequelize';

const Image = sequelize.define('Image', {
  post_id: DataTypes.BIGINT,
  url: DataTypes.STRING,
  index: DataTypes.INTEGER,
}, {
  tableName: 'images',
  timestamps: false,
});

Image.belongsTo(Post, { foreignKey: 'post_id' });

export default Image;
