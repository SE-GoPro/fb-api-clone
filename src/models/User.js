import { DataTypes } from 'sequelize';
import sequelize from 'utils/sequelize';

const User = sequelize.define('User', {
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  phonenumber: DataTypes.STRING,
  avatar_url: DataTypes.STRING,
}, {
  tableName: 'users',
  timestamps: false,
});

export default User;
