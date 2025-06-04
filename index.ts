/* eslint-disable import/first */
import * as dotenv from 'dotenv';

if (process.env.NODE_ENV === 'development') {
  dotenv.config();
}
import express from 'express';
import cors from 'cors';
import type http from 'http';
import passport from './auth/google.passport';
import usersRoutes from './users/users.routes';
import meRoutes from './me/me.routes';
import postsRoutes from './posts/posts.routes';
import authRoutes from './auth/auth.routes';
import mongodbRoutes from './common/services/mongodb/mongodb.routes';
import MongoDbService from './common/services/mongodb/mongodb.service';

// Initializes express application
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use('/users', usersRoutes);
app.use('/me', meRoutes);
app.use('/posts', postsRoutes);
app.use('/auth', authRoutes);
if (process.env.NODE_ENV === 'development') {
  app.use('/mongodb', mongodbRoutes);
}

let server: http.Server;

export const startServer = async (): Promise<void> => {
  // Open mongodb connection
  await MongoDbService.connectWithRetry();

  server = app.listen(process.env.API_PORT, () =>
    // eslint-disable-next-line no-console
    console.log(`Server listening on port ${process.env.API_PORT}`)
  );
};

export const stopServer = async (): Promise<void> => {
  // eslint-disable-next-line no-console
  server.close(() => console.log('Server stopped'));

  // Close mongodb connection
  await MongoDbService.close();
};

startServer();

export default app;
