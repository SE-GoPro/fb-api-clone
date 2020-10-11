import { DataTypes } from 'sequelize';
import sequelize from 'utils/sequelize';

const User = sequelize.define('User', {
  name: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: {
        msg: 'Email address is not valid',
      },
    },
  },
  password: DataTypes.STRING,
  phonenumber: {
    type: DataTypes.STRING,
    validate: {
      is: {
        args: new RegExp(/^[0][0-9]{9}$/g),
        msg: 'Phone number must be 10 in length and start with 0',
      },
    },
  },
  avatar_url: DataTypes.STRING,
  verify_code: DataTypes.STRING,
  is_verified: DataTypes.BOOLEAN,
}, {
  tableName: 'users',
  timestamps: false,
});

export default User;
