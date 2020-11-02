import User from 'models/User';
import { DataTypes } from 'sequelize';
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

export default Search;
