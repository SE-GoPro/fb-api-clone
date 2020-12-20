import User from 'models/User';
import { QueryTypes, DataTypes } from 'sequelize';
import sequelize from 'utils/sequelize';

const Friend = sequelize.define('Friend', {
  requester_id: DataTypes.BIGINT,
  requestee_id: DataTypes.BIGINT,
  status: DataTypes.STRING,
  created: DataTypes.DATE,
  accepted: DataTypes.DATE,
}, {
  tableName: 'friends',
  timestamps: false,
});

Friend.belongsTo(User, { foreignKey: 'requester_id' });
Friend.belongsTo(User, { foreignKey: 'requestee_id' });

Friend.getSuggestedFriends = (userId, index, count) => sequelize.query(
  `SELECT users.id AS user_id, name AS username, avatar_url AS avatar
  FROM users
  WHERE id NOT IN (
    SELECT requester_id FROM friends WHERE requestee_id = :userId
    UNION
    SELECT requestee_id FROM friends WHERE requester_id = :userId
    UNION
    SELECT blocker_id FROM blocks WHERE blockee_id = :userId
    UNION
    SELECT blockee_id FROM blocks WHERE blocker_id = :userId
    UNION
    SELECT :userId
  )
  AND is_verified = true
  AND (is_blocked IS NULL OR is_blocked = false)
  LIMIT :limit
  OFFSET :offset`,
  {
    type: QueryTypes.SELECT,
    replacements: {
      userId,
      limit: count,
      offset: index,
    },
  },
);

export default Friend;
