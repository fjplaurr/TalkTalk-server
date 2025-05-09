import type { Request, Response } from 'express';
import UsersService from './users.service';
import type {
  CreateUserPayload,
  RequestWithBody,
  RequestWithParams,
} from './types/dto';

class UsersController {
  async readById(req: RequestWithParams<{ id: string }>, res: Response) {
    const user = await UsersService.readById(req.params.id);
    res.status(200).send(user);
  }

  async readAll(req: Request, res: Response) {
    const users = await UsersService.readAll();
    res.status(200).send(users);
  }

  async create(req: RequestWithBody<CreateUserPayload>, res: Response) {
    const userId = await UsersService.create(req.body);
    res.status(201).send({ id: userId });
  }

  async deleteById(req: RequestWithParams<{ id: string }>, res: Response) {
    await UsersService.deleteById(req.params.id);
    res.status(204).send();
  }

  async readFollowing(req: RequestWithParams<{ id: string }>, res: Response) {
    const usersIds = await UsersService.readFollowing(req.params.id);
    res.status(200).send(usersIds);
  }
}

export default new UsersController();
