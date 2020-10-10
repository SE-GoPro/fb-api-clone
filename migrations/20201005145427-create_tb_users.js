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
    email: Sequelize.STRING,
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    phonenumber: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    avatar_url: Sequelize.STRING,
  });
}
export function down(queryInterface) {
  return queryInterface.dropTable('users');
}
