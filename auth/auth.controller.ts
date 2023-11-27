import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UsersService from '../users/users.service';

const jwtSecret: string = process.env.AUTHENTICATION_SECRET_KEY!;
const tokenExpirationInSeconds = 36000;

const createJWT = (payload: object) =>
  jwt.sign(payload, jwtSecret, {
    expiresIn: tokenExpirationInSeconds,
  });
class AuthController {
  async login(req: Request, res: Response) {
    const user = await UsersService.getUserByEmail(req.body.email);
    const accessToken = createJWT({ userId: user!._id });

    return res.status(201).send({ accessToken, user });
  }

  async signup(req: Request, res: Response) {
    const userId = await UsersService.create(req.body);
    const accessToken = createJWT({ userId });
    const user = await UsersService.readById(userId);

    return res.status(201).send({ accessToken, user });
  }
}

export default new AuthController();
