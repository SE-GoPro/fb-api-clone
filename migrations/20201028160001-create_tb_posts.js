export function up(queryInterface, Sequelize) {
  return queryInterface.createTable('posts', {
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
    described: Sequelize.STRING,
    created: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Date.now(),
    },
    modified: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Date.now(),
    },
    status: Sequelize.STRING,
    banned: Sequelize.STRING,
    can_comment: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  });
}
export function down(queryInterface) {
  return queryInterface.dropTable('posts');
}
