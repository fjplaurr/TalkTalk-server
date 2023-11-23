/* eslint-disable import/first */
import * as dotenv from 'dotenv';

if (process.env.NODE_ENV === 'development') {
  dotenv.config();
}
import express from 'express';
import cors from 'cors';
import usersRoutes from './users/users.routes.config';
import postsRoutes from './posts/posts.routes.config';
import authRoutes from './auth/auth.routes.config';
import mongodbRoutes from './common/services/mongodb/mongodb.routes.config';

// Initializes express application
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/users', usersRoutes);
app.use('/posts', postsRoutes);
app.use('/auth', authRoutes);
if (process.env.NODE_ENV === 'development') {
  app.use('/mongodb', mongodbRoutes);
}

// Server listening
export default app.listen(process.env.API_PORT, () =>
  console.log(`Server listening on port ${process.env.API_PORT}`)
);
