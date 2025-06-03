import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UsersService from '@users/users.service';
import { sanitizeUser } from '@users/utils';
import type { User } from '@users/types/users';
import type { CreateUserPayload } from '@users/types/dto';
import type { AuthMiddlewareLocals } from './middleware/auth.middleware';

const jwtSecret: string = process.env.AUTHENTICATION_SECRET_KEY!;
const tokenExpirationInSeconds = 36000;

export type JwtPayload = {
  userId: string;
};

export const createJWT = (payload: JwtPayload): string =>
  jwt.sign(payload, jwtSecret, {
    expiresIn: tokenExpirationInSeconds,
  });

class AuthController {
  async login(req: Request, res: Response): Promise<Response> {
    const { user } = res.locals as AuthMiddlewareLocals;
    const accessToken: string = createJWT({ userId: user._id });
    return res.status(201).send({ accessToken, user: sanitizeUser(user) });
  }

  async signup(
    req: Request<{}, {}, CreateUserPayload>,
    res: Response
  ): Promise<Response<{ accessToken: string; user: User | null }>> {
    const userId: string = await UsersService.create(req.body);
    const accessToken: string = createJWT({ userId });
    const user: User | null = await UsersService.readById(userId);

    return res.status(201).send({ accessToken, user: sanitizeUser(user) });
  }

  async googleSignup(req: Request, res: Response): Promise<Response | void> {
    // User is attached to req.user by passport
    const user = req.user as User;
    if (!user) {
      return res.redirect('/auth/login');
    }
    const accessToken: string = createJWT({ userId: user._id });
    return res.status(201).send({ accessToken, user: sanitizeUser(user) });
  }
}

export default new AuthController();
