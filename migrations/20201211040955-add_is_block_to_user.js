export function up(queryInterface, Sequelize) {
  return queryInterface.addColumn('users', 'is_blocked', Sequelize.BOOLEAN);
}

export function down(queryInterface) {
  return queryInterface.removeColumn('users', 'is_blocked');
}
