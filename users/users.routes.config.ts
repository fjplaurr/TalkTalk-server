import express from 'express';
import { body } from 'express-validator';
import UsersController from './users.controller';
import PostsController from '../posts/posts.controller';
import UsersMiddleware from './middleware/users.middleware';
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';

const router = express.Router();

router.post('/', [
  ...UsersMiddleware.createBodyValidations,
  BodyValidationMiddleware.validateRequest,
  UsersController.create,
]);

router.get('/:id', UsersController.readById);
router.get('/', UsersController.readAll);
router.patch('/:id', UsersController.updateById);
router.delete('/:id', UsersController.deleteById);

router.get('/:id/following', UsersController.readFollowing);
router.get('/:id/posts', PostsController.readPostsByUserId);

export default router;
