export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('images', {
    id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
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
    url: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
}
export function down(queryInterface) {
  return queryInterface.dropTable('images');
}
