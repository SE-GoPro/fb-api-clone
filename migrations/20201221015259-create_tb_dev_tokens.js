export function up(queryInterface, Sequelize) {
  return queryInterface.createTable('dev_tokens', {
    id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    devtype: Sequelize.STRING,
    devtoken: Sequelize.STRING,
    user_id: {
      type: Sequelize.BIGINT,
      references: {
        model: {
          tableName: 'users',
        },
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  });
}
export function down(queryInterface) {
  return queryInterface.dropTable('dev_tokens');
}
