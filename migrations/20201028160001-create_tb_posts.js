export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('posts', {
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
    described: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    created: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    emotion: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    modified: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    state: Sequelize.STRING,
    banned: Sequelize.STRING,
    can_comment: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
  });
}
export function down(queryInterface) {
  return queryInterface.dropTable('posts');
}
