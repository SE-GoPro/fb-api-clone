import { DataTypes } from 'sequelize';
import sequelize from 'utils/sequelize';
import User from 'models/User';

const Token = sequelize.define('Token', {
  user_id: DataTypes.BIGINT,
  token: DataTypes.STRING,
}, {
  tableName: 'tokens',
  timestamps: false,
});

Token.removeAttribute('id');
Token.belongsTo(User, { foreignKey: 'user_id' });

export default Token;
