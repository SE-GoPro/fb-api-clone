import { DataTypes, QueryTypes } from 'sequelize';
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

Token.updateToken = (userId, token) => sequelize.query(
  'INSERT INTO tokens (user_id, token) VALUES (:userId, :token) ON CONFLICT (user_id) DO UPDATE SET token = EXCLUDED.token',
  { type: QueryTypes.UPSERT, replacements: { userId, token } },
);

export default Token;
