export function up(queryInterface, Sequelize) {
  return queryInterface.createTable('searchs', {
    id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: Sequelize.BIGINT,
      references: {
        model: {
          tableName: 'users',
        },
        key: 'id',
      },
      onDelete: 'CASCADE',
      allowNull: false,
    },
    keyword: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    created: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });
}
export function down(queryInterface) {
  return queryInterface.dropTable('searchs');
}
