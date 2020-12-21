import sequelize from 'utils/sequelize';
import { DataTypes } from 'sequelize';
import User from './User';

const Notification = sequelize.define('Notification', {
  type: DataTypes.STRING,
  object_id: DataTypes.BIGINT,
  title: DataTypes.STRING,
  created: DataTypes.DATE,
  avatar: DataTypes.STRING,
  group: {
    type: DataTypes.ENUM,
    values: ['0', '1', '2', '3'],
    defaultValue: '0',
  },
  read_at: DataTypes.DATE,
  user_id: DataTypes.BIGINT,
}, {
  tableName: 'notifications',
  timestamps: false,
});

Notification.belongsTo(User, { foreignKey: 'user_id' });

export default Notification;
