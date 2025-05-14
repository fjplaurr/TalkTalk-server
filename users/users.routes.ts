import express from 'express';
import UsersController from '@users/users.controller';
import PostsController from '@posts/posts.controller';

const router = express.Router();

router.get('/:id', UsersController.readById);
router.get('/', UsersController.readAll);
router.get('/:id/following', UsersController.readFollowing);
router.get('/:id/posts', PostsController.readPostsByUserId);

export default router;
