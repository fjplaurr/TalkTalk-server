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

  async followUser(req: RequestWithParams<{ id: string }>, res: Response) {
    const { userId } = res.locals.jwt as { userId: string };
    const { id: followedUserId } = req.params;

    if (userId === followedUserId) {
      return res.status(400).send({ message: 'You cannot follow yourself' });
    }

    // Check if the user and followed user exist
    const user = await UsersService.readById(userId);
    const followedUser = await UsersService.readById(followedUserId);
    if (!user || !followedUser) {
      return res.status(404).send();
    }

    if (user.followingUsers.includes(followedUserId)) {
      return res
        .status(400)
        .send({ message: 'You are already following this user' });
    }

    await UsersService.followUser(user, followedUserId);

    return res.status(204).send();
  }
}

export default new UsersController();
