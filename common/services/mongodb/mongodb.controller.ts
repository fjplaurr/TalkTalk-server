import { Request, Response } from 'express';
import MongoService from './mongodb.service';

class MongoController {
  async dropDB(req: Request, res: Response) {
    try {
      await MongoService.dropDB();
      return res.status(204).send();
    } catch (err) {
      console.log(`It was not possible to set a drop the database:`, err);
      return res.status(422).send();
    }
  }

  async seedDB(req: Request, res: Response) {
    try {
      await MongoService.seedDB();
      return res.status(201).send();
    } catch (err) {
      console.log(`It was not possible to reseed the database:`, err);
      return res.sendStatus(422);
    }
  }
}

export default new MongoController();
