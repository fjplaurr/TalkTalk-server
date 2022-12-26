import { Request, Response } from 'express';
import UsersService from './users.service';

class UsersController {
  async readById(req: Request, res: Response) {
    const user = await UsersService.readById(req.params.id);
    res.status(200).send(user);
  }

  async readAll(req: Request, res: Response) {
    const users = await UsersService.readAll();
    res.status(200).send(users);
  }
}

export default new UsersController();
