export function up(queryInterface, Sequelize) {
  return queryInterface.createTable('reports', {
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
    subject: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    details: Sequelize.STRING,
  });
}
export function down(queryInterface) {
  return queryInterface.dropTable('reports');
}
