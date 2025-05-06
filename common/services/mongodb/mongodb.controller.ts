import type { Request, Response } from 'express';
import MongoDbService from './mongodb.service';

class MongoDbController {
  async dropDB(req: Request, res: Response) {
    try {
      await MongoDbService.dropDB();
      return res.status(204).send();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(`It was not possible to drop the database:`, err);
      return res.status(422).send();
    }
  }

  async seedDB(req: Request, res: Response) {
    try {
      const wasSeeded = await MongoDbService.seedDB();
      return wasSeeded ? res.status(201).send() : res.status(500).send();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(`It was not possible to reseed the database:`, err);
      return res.sendStatus(500);
    }
  }
}

export default new MongoDbController();
