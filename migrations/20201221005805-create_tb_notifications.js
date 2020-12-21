export function up(queryInterface, Sequelize) {
  return queryInterface.createTable('notifications', {
    id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    type: Sequelize.STRING, // TODO: to enum
    object_id: Sequelize.BIGINT,
    title: Sequelize.STRING,
    created: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    avatar: Sequelize.STRING,
    group: {
      type: Sequelize.ENUM,
      values: ['0', '1', '2', '3'],
      defaultValue: '0',
    },
    read_at: Sequelize.DATE,
    user_id: {
      type: Sequelize.BIGINT,
      references: {
        model: {
          tableName: 'users',
        },
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  });
}
export function down(queryInterface) {
  return queryInterface.dropTable('notifications');
}
