export function up(queryInterface, Sequelize) {
  return queryInterface.createTable('users', {
    id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: Sequelize.STRING,
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
    verify_code: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    is_verified: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    last_verified_at: Sequelize.DATE,
  });
}
export function down(queryInterface) {
  return queryInterface.dropTable('users');
}
