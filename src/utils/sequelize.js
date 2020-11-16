import { Sequelize } from 'sequelize';
import sequelizeConfigs from '../../sequelize.config';

const API_NODE_ENV = process.API_NODE_ENV || 'local';
const config = sequelizeConfigs[API_NODE_ENV];

const sequelize = new Sequelize(config.url, {
  logging: false,
  dialectOptions: config.dialectOptions,
  query: {
    raw: true,
    logging: false,
  },
});

export function getTimeField(fieldName) {
  return sequelize.Sequelize.literal(`(EXTRACT(EPOCH FROM ${fieldName}))::BIGINT AS ${fieldName}`);
}

export default sequelize;
