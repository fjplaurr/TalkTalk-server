import { Request, Response } from 'express';
import argon2 from 'argon2';
import UsersService from './users.service';
import {
  CreateUserPayload,
  PatchUserPayload,
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
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

  async updateById(
    req: RequestWithParamsAndBody<PatchUserPayload, { id: string }>,
    res: Response
  ) {
    if (req.body.password) {
      req.body.password = await argon2.hash(req.body.password);
    }
    const modifiedDocuments = await UsersService.updateById(
      req.params.id,
      req.body
    );

    if (modifiedDocuments > 0) {
      res.status(200).send({ id: req.params.id });
    } else {
      res.status(304).send();
    }
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
