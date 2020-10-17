import { DataTypes, QueryTypes } from 'sequelize';
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
        msg: 'Phonenumber must be 10 in length, contain only numeric characters and start with 0',
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

User.updateVerifiedTime = (userId) => sequelize.query(
  'UPDATE users SET last_verified_at = NOW() where id = :userId',
  { type: QueryTypes.UPDATE, replacements: { userId } },
);

export default User;
