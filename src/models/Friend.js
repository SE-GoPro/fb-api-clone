import User from 'models/User';
import { DataTypes } from 'sequelize';
import sequelize from 'utils/sequelize';

const Friend = sequelize.define('Friend', {
  requester_id: DataTypes.BIGINT,
  requestee_id: DataTypes.BIGINT,
  status: DataTypes.STRING,
  created: DataTypes.DATE,
}, {
  tableName: 'friends',
  timestamps: false,
});

Friend.belongsTo(User, { foreignKey: 'requester_id' });
Friend.belongsTo(User, { foreignKey: 'requestee_id' });
export default Friend;
