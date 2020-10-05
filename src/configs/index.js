import localConfigs from './local';
import devConfigs from './dev';
import prodConfigs from './prod';

let configs = localConfigs;

if (process.env.API_NODE_ENV === 'prod') {
  configs = prodConfigs;
} else if (process.env.API_NODE_ENV === 'dev') {
  configs = devConfigs;
}

export default Object.freeze(configs);
