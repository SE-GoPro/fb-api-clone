export function up(queryInterface, Sequelize) {
  return queryInterface.createTable('users', {
    id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    phone_number: Sequelize.STRING,
    avatar_url: Sequelize.STRING,
  });
}
export function down(queryInterface, Sequelize) {
  return queryInterface.dropTable('users');
}
