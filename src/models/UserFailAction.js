import User from 'models/User';
import { DataTypes } from 'sequelize';
import sequelize from 'utils/sequelize';

const UserFailAction = sequelize.define('UserFailAction', {
  user_id: DataTypes.BIGINT,
  change_username: DataTypes.INTEGER,
}, {
  tableName: 'user_fail_actions',
  timestamps: false,
});

UserFailAction.removeAttribute('id');
UserFailAction.belongsTo(User, { foreignKey: 'user_id' });

export default UserFailAction;
