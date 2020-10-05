import { DataTypes } from 'sequelize';
import sequelize from 'utils/sequelize';

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone_number: DataTypes.STRING,
  avatar_url: DataTypes.STRING,
}, {
  tableName: 'users',
  timestamps: false
});

export default User;
