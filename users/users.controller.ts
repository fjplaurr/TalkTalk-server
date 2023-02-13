import { Request, Response } from 'express';
import argon2 from 'argon2';
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

  async create(req: Request, res: Response) {
    req.body.password = await argon2.hash(req.body.password);
    const userId = await UsersService.create(req.body);
    res.status(201).send({ id: userId });
  }

  async updateById(req: Request, res: Response) {
    if (req.body.password) {
      req.body.password = await argon2.hash(req.body.password);
    }
    await UsersService.updateById(req.params.id, req.body);
    res.status(204).send();
  }

  async deleteById(req: Request, res: Response) {
    await UsersService.deleteById(req.params.id);
    res.status(204).send();
  }

  async readFollowing(req: Request, res: Response) {
    const users = await UsersService.readFollowing(req.params.id);
    res.status(200).send(users);
  }
}

export default new UsersController();
