import express from 'express';
import UsersController from '@users/users.controller';
import PostsController from '@posts/posts.controller';
import UsersMiddleware from './middleware/users.middleware';

const router = express.Router();

router.post('/', [
  ...UsersMiddleware.createBodyValidations,
  UsersController.create,
]);

router.get('/:id', UsersController.readById);
router.get('/', UsersController.readAll);
router.delete('/:id', UsersController.deleteById);

router.get('/:id/following', UsersController.readFollowing);
router.get('/:id/posts', PostsController.readPostsByUserId);

export default router;
