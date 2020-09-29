import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'utils/dotenv';
import configs from 'configs';

dotenv.config();

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send("Welcome to Node Babel")
});

app.listen(configs.apiPort,() => {
  console.log(`API is running on ${configs.apiPort}`);
})