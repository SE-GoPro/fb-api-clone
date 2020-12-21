export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('searchs', {
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
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  });

  await queryInterface.addIndex('searchs', ['user_id', 'keyword'], { unique: true });
}
export function down(queryInterface) {
  return queryInterface.dropTable('searchs');
}
