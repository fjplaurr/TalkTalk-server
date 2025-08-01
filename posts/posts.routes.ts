import express from 'express';
import jwtMiddleware from '@auth/middleware/jwt.middleware';
import PostsController from './posts.controller';

const router = express.Router();

router.post('/', jwtMiddleware.validJWTNeeded, PostsController.create);
router.get('/:id', PostsController.readById);
router.get('/', PostsController.readAll);
router.patch('/:id', jwtMiddleware.validJWTNeeded, PostsController.updateById);
router.delete('/:id', jwtMiddleware.validJWTNeeded, PostsController.deleteById);

export default router;
