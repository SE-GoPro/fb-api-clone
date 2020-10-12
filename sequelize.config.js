/* eslint-disable import/newline-after-import, import/no-extraneous-dependencies */
require('@babel/register');
require('./src/utils/dotenv').default.config();
const API_NODE_ENV = process.env.API_NODE_ENV || 'local';

module.exports = {
  [API_NODE_ENV]: {
    url: process.env.DB_URL,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
};
