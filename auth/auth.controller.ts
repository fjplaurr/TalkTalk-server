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
  createAccessToken(req: Request, res: Response) {
    const token = createJWT(req.body);

    return res.status(201).send({ accessToken: token });
  }

  async signup(req: Request, res: Response) {
    const token = createJWT(req.body);
    const userId = await UsersService.create(req.body);

    return res.status(201).send({ accessToken: token, userId });
  }
}

export default new AuthController();
