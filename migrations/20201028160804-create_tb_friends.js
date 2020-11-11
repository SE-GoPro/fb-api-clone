export function up(queryInterface, Sequelize) {
  return queryInterface.createTable('friends', {
    id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    requester_id: {
      type: Sequelize.BIGINT,
      references: {
        model: {
          tableName: 'users',
        },
        key: 'id',
      },
      onDelete: 'CASCADE',
      allowNull: false,
    },
    requestee_id: {
      type: Sequelize.BIGINT,
      references: {
        model: {
          tableName: 'users',
        },
        key: 'id',
      },
      onDelete: 'CASCADE',
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    created: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Date.now(),
    },
  });
}
export function down(queryInterface) {
  return queryInterface.dropTable('friends');
}
