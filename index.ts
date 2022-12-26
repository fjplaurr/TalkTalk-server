/* eslint-disable import/first */
import * as dotenv from 'dotenv';

if (process.env.NODE_ENV === 'development') {
  dotenv.config();
}

import * as express from 'express';
import * as cors from 'cors';
import config from './config';

// Initializes express application
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Server listening
app.listen(config.PORT, () =>
  console.log(`Server listening on port ${config.PORT}`)
);
