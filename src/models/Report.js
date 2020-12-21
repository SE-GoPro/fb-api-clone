import Post from 'models/Post';
import User from 'models/User';
import { DataTypes } from 'sequelize';
import sequelize from 'utils/sequelize';

const Report = sequelize.define('Report', {
  user_id: DataTypes.BIGINT,
  post_id: DataTypes.BIGINT,
  subject: DataTypes.STRING,
  details: DataTypes.STRING,
}, {
  tableName: 'reports',
  timestamps: false,
});

Report.belongsTo(User, { foreignKey: 'user_id' });
Report.belongsTo(Post, { foreignKey: 'post_id' });

export default Report;
