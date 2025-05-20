import express from 'express';
import MongoDbController from './mongodb.controller';

const router = express.Router();

if (process.env.NODE_ENV === 'development') {
  router.post('/drop', MongoDbController.dropDB);
  router.post('/seed', MongoDbController.seedDB);
}

export default router;
