export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('posts', {
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
    described: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    created: Sequelize.DATE,
    emotion: Sequelize.STRING,
    modified: Sequelize.DATE,
    state: Sequelize.STRING,
    banned: Sequelize.STRING,
    can_comment: Sequelize.BOOLEAN,
  });
}
export function down(queryInterface) {
  return queryInterface.dropTable('posts');
}
