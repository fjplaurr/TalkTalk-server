import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UsersService from '../users/users.service';
import { User } from '../users/types/users';

const jwtSecret: string = process.env.AUTHENTICATION_SECRET_KEY!;
const tokenExpirationInSeconds = 36000;

export const createJWT = (payload: object): string =>
  jwt.sign(payload, jwtSecret, {
    expiresIn: tokenExpirationInSeconds,
  });
class AuthController {
  async login(req: Request, res: Response) {
    const user = await UsersService.getUserByEmail(req.body.email);
    if (!user) {
      return res.status(404).send();
    }
    const accessToken = createJWT({ userId: user._id });
    return res.status(201).send({ accessToken, user });
  }

  async signup(
    req: Request,
    res: Response
  ): Promise<Response<{ accessToken: string; user: User | null }>> {
    const userId: string = await UsersService.create(req.body);
    const accessToken: string = createJWT({ userId });
    const user: User | null = await UsersService.readById(userId);

    return res.status(201).send({ accessToken, user });
  }
}

export default new AuthController();
