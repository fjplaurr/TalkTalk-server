import express from 'express';
import UsersController from './users.controller';
import PostsController from '../posts/posts.controller';

const router = express.Router();

router.post('/', UsersController.create);
router.get('/:id', UsersController.readById);
router.get('/', UsersController.readAll);
router.patch('/:id', UsersController.updateById);
router.delete('/:id', UsersController.deleteById);

router.get('/:id/posts', PostsController.readPostsByUserId);

export default router;
