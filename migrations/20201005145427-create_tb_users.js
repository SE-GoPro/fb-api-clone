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
    created: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    description: Sequelize.STRING,
    cover_image_url: Sequelize.STRING,
    link: Sequelize.STRING,
    address: Sequelize.STRING,
    city: Sequelize.STRING,
    country: Sequelize.STRING,
  });
}
export function down(queryInterface) {
  return queryInterface.dropTable('users');
}
