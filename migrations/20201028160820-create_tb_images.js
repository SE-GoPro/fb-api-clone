export function up(queryInterface, Sequelize) {
  return queryInterface.createTable('images', {
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
