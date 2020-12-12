export function up(queryInterface, Sequelize) {
  return queryInterface.addColumn('images', 'index', Sequelize.INTEGER);
}
export function down(queryInterface) {
  return queryInterface.removeColumn('images', 'index');
}
