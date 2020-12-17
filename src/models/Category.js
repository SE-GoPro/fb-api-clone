import { DataTypes } from 'sequelize';
import sequelize from 'utils/sequelize';

const Category = sequelize.define('Category', {
  id: DataTypes.INTEGER,
  name: DataTypes.STRING,
}, {
  tableName: 'categories',
  timestamps: false,
});

export default Category;
