import User from 'models/User';
import { DataTypes } from 'sequelize';
import sequelize from 'utils/sequelize';

const Block = sequelize.define('Block', {
  blocker_id: DataTypes.BIGINT,
  blockee_id: DataTypes.BIGINT,
}, {
  tableName: 'blocks',
  timestamps: false,
});

Block.removeAttribute('id');

Block.belongsTo(User, { foreignKey: 'blocker_id' });
Block.belongsTo(User, { foreignKey: 'blockee_id' });

export default Block;
