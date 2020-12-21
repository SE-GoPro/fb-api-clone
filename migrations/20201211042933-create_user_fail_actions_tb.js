export function up(queryInterface, Sequelize) {
  return queryInterface.createTable('user_fail_actions', {
    user_id: {
      type: Sequelize.BIGINT,
      references: {
        model: {
          tableName: 'users',
        },
        key: 'id',
      },
      onDelete: 'CASCADE',
      primaryKey: true,
    },
    change_username: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  });
}
export function down(queryInterface) {
  return queryInterface.dropTable('user_fail_actions');
}
