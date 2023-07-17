import express from 'express';
import { body } from 'express-validator';
import UsersController from './users.controller';
import PostsController from '../posts/posts.controller';
import UsersMiddleware from './middleware/users.middleware';
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';

const router = express.Router();

router.post('/', [
  body('email')
    .isEmail()
    .custom((email) => UsersMiddleware.validateSameEmailDoesntExist(email)),
  body('password')
    .isStrongPassword({
      minLength: 6,
      minNumbers: 0,
      minSymbols: 0,
    })
    .withMessage(
      'Please use a password that is at least 6 characters long and includes both lowercase and uppercase letters.'
    ),
  BodyValidationMiddleware.verifyBodyFieldsErrors,
  UsersController.create,
]);

router.get('/:id', UsersController.readById);
router.get('/', UsersController.readAll);
router.patch('/:id', UsersController.updateById);
router.delete('/:id', UsersController.deleteById);

router.get('/:id/following', UsersController.readFollowing);
router.get('/:id/posts', PostsController.readPostsByUserId);

export default router;
