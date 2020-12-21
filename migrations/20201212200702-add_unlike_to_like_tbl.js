export function up(queryInterface, Sequelize) {
  return queryInterface.addColumn('likes', 'unlike', Sequelize.BOOLEAN);
}
export function down(queryInterface) {
  return queryInterface.removeColumn('likes', 'unlike');
}
