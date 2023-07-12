import { Request, Response } from 'express';
import MongoDbService from './mongodb.service';

class MongoDbController {
  async dropDB(req: Request, res: Response) {
    try {
      await MongoDbService.dropDB();
      return res.status(204).send();
    } catch (err) {
      console.log(`It was not possible to set a drop the database:`, err);
      return res.status(422).send();
    }
  }

  async seedDB(req: Request, res: Response) {
    try {
      await MongoDbService.seedDB();
      return res.status(201).send();
    } catch (err) {
      console.log(`It was not possible to reseed the database:`, err);
      return res.sendStatus(422);
    }
  }
}

export default new MongoDbController();
