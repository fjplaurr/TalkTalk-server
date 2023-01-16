import * as express from 'express';
import PostsController from './posts.controller';

const router = express.Router();

router.post('/', PostsController.create);
router.get('/:id', PostsController.readById);
router.get('/', PostsController.readAll);
router.patch('/:id', PostsController.updateById);
router.delete('/:id', PostsController.deleteById);

export default router;
