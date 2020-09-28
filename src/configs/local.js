import baseConfig from './base';

const config = {
  apiUrl: `http://localhost:${baseConfig.apiPort}`,
};

export default Object.freeze(Object.assign({}, baseConfig, config));
