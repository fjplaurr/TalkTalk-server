/* eslint-disable import/first */
import * as dotenv from 'dotenv';

if (process.env.NODE_ENV === 'development') {
  dotenv.config();
}

import * as express from 'express';
import * as cors from 'cors';
import config from './config';
import usersRoutes from './users/users.routes.config';
import postsRoutes from './posts/posts.routes.config';

// Initializes express application
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/users', usersRoutes);
app.use('/posts', postsRoutes);

// Server listening
app.listen(config.PORT, () =>
  console.log(`Server listening on port ${config.PORT}`)
);
