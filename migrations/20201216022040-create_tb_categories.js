export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('categories', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: Sequelize.STRING,
  });

  await queryInterface.addColumn('posts', 'category_id', {
    type: Sequelize.INTEGER,
    references: {
      model: {
        tableName: 'categories',
      },
      key: 'id',
    },
    onDelete: 'NO ACTION',
  });
}
export async function down(queryInterface) {
  await queryInterface.removeColumn('posts', 'category_id');
  await queryInterface.dropTable('categories');
}
