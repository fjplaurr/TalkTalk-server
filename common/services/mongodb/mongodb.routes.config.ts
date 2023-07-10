import express from 'express';
import MongoController from './mongodb.controller';

const router = express.Router();

router.post('/drop', MongoController.dropDB);
router.post('/seed', MongoController.seedDB);

export default router;
