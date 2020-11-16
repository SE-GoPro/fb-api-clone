import User from 'models/User';
import { DataTypes, QueryTypes } from 'sequelize';
import sequelize from 'utils/sequelize';

const Search = sequelize.define('Search', {
  user_id: DataTypes.BIGINT,
  keyword: DataTypes.STRING,
  created: DataTypes.DATE,
}, {
  tableName: 'searchs',
  timestamps: false,
});

Search.belongsTo(User, { foreignKey: 'user_id' });

Search.upsertKeyword = ({
  userId,
  keyword,
}) => sequelize.query(
  'INSERT INTO searchs (user_id, keyword) VALUES (:userId, :keyword) ON CONFLICT (user_id, keyword) DO UPDATE SET created = CURRENT_TIMESTAMP',
  { type: QueryTypes.UPSERT, replacements: { userId, keyword } },
);

export default Search;
