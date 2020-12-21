import { DataTypes } from 'sequelize';
import sequelize from 'utils/sequelize';
import User from './User';

const DevToken = sequelize.define('DevToken', {
  devtype: DataTypes.STRING,
  devtoken: DataTypes.STRING,
  user_id: DataTypes.BIGINT,
}, {
  tableName: 'dev_tokens',
  timestamps: false,
});

DevToken.belongsTo(User, { foreignKey: 'user_id' });

export default DevToken;
