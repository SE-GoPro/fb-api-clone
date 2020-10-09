import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'utils/dotenv';
import configs from 'configs';
import { handleAPIError, handleNotFoundError } from 'middlewares/handleError';

dotenv.config();

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Welcome to Node Babel');
});

app.use(handleAPIError);
app.use(handleNotFoundError);

app.listen(configs.apiPort, () => {
  console.log(`API is running on ${configs.apiPort}`);
});
