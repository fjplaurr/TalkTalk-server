import express from 'express';
import cors from 'cors';
import usersRoutes from './users/users.routes.config';
import postsRoutes from './posts/posts.routes.config';
import authRoutes from './auth/auth.routes.config';

// Initializes express application
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/users', usersRoutes);
app.use('/posts', postsRoutes);
app.use('/auth', authRoutes);

// Server listening
app.listen(process.env.API_PORT, () =>
  console.log(`Server listening on port ${process.env.API_PORT}`)
);
