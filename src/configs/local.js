import baseConfig from './base';

const config = {
  ...baseConfig,
  apiUrl: `http://localhost:${baseConfig.apiPort}`,
};

export default Object.freeze(config);
