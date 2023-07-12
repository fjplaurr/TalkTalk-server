import express from 'express';
import MongoDbController from './mongodb.controller';

const router = express.Router();

router.post('/drop', MongoDbController.dropDB);
router.post('/seed', MongoDbController.seedDB);

export default router;
