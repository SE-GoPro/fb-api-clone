export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('notification_settings', {
    id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    like_comment: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    from_friends: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    requested_friend: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    suggested_friend: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    birthday: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    video: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    report: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    sound_on: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    notification_on: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    vibrant_on: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    led_on: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  });
}
export function down(queryInterface) {
  return queryInterface.dropTable('notification_settings');
}
