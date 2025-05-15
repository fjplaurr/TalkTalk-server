import express from 'express';
import UsersController from '@users/users.controller';
import PostsController from '@posts/posts.controller';
import jwtMiddleware from '@auth/middleware/jwt.middleware';

const router = express.Router();

router.get('/:id', UsersController.readById);
router.get('/', UsersController.readAll);
router.get('/:id/posts', PostsController.readPostsByUserId);
router.get('/:id/following', UsersController.readFollowing);
router.post(
  '/:id/follow',
  jwtMiddleware.validJWTNeeded,
  UsersController.followUser
);

export default router;
