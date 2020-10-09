export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('tokens', {
    user_id: {
      type: Sequelize.BIGINT,
      references: {
        model: {
          tableName: 'users',
        },
        key: 'id',
      },
    },
    token: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  await queryInterface.addIndex('tokens', ['user_id', 'token'], { indicesType: 'UNIQUE' });
}
export function down(queryInterface) {
  return queryInterface.dropTable('tokens');
}
