import express from 'express';
import UsersController from './users.controller';

const router = express.Router();

router.post('/', UsersController.create);
router.get('/:id', UsersController.readById);
router.get('/', UsersController.readAll);
router.patch('/:id', UsersController.updateById);
router.delete('/:id', UsersController.deleteById);

export default router;
