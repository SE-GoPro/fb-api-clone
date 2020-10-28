export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('likes', {
    user_id: {
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
    post_id: {
      type: Sequelize.BIGINT,
      references: {
        model: {
          tableName: 'posts',
        },
        key: 'id',
      },
      onDelete: 'CASCADE',
      allowNull: false,
    },
  });
}
export function down(queryInterface) {
  return queryInterface.dropTable('likes');
}
