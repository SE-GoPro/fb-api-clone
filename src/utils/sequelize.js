import sequelizeConfigs from '../../sequelize.config';
import { Sequelize } from 'sequelize';

const API_NODE_ENV = process.API_NODE_ENV || 'local';
const config = sequelizeConfigs[API_NODE_ENV];

const sequelize = new Sequelize(config.url, {
  dialectOptions: config.dialectOptions,
  query: {
    raw: true,
    logging: false
  }
});

export default sequelize;
