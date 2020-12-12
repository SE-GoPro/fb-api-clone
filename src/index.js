import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'utils/dotenv';
import configs from 'configs';
import { handleAPIError, handleNotFoundError } from 'middlewares/handleErrors';
import routes from 'routes/index';

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Welcome to Node Babel');
});

app.use('/it4788', routes);
app.use(handleAPIError);
app.use(handleNotFoundError);

app.listen(configs.apiPort, () => {
  console.log(`API is running on ${configs.apiPort}`);
});
