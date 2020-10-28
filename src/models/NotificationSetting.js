import { DataTypes } from 'sequelize';
import sequelize from 'utils/sequelize';

const NotificationSetting = sequelize.define('NotificationSetting', {
  like_comment: DataTypes.BOOLEAN,
  from_friends: DataTypes.BOOLEAN,
  requested_friend: DataTypes.BOOLEAN,
  suggested_friend: DataTypes.BOOLEAN,
  birthday: DataTypes.BOOLEAN,
  video: DataTypes.BOOLEAN,
  report: DataTypes.BOOLEAN,
  sound_on: DataTypes.BOOLEAN,
  notification_on: DataTypes.BOOLEAN,
  vibrant_on: DataTypes.BOOLEAN,
  led_on: DataTypes.BOOLEAN,
}, {
  tableName: 'notification_settings',
  timestamps: false,
});

export default NotificationSetting;
