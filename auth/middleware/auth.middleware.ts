import type { Request, Response, NextFunction } from 'express';
import argon2 from 'argon2';
import usersService from '@users/users.service';
import type { User } from '@users/types/users';

export type AuthMiddlewareLocals = Response['locals'] & {
  user: User;
};
class AuthMiddleware {
  async verifyUserPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    const user = await usersService.getUserByEmail(req.body.email);

    if (user) {
      const passwordHash = user.password;

      const isPasswordValid = await argon2.verify(
        passwordHash,
        req.body.password
      );

      if (isPasswordValid) {
        (res.locals as AuthMiddlewareLocals).user = user;
        return next();
      }

      return res
        .status(400)
        .send({ errors: ['Invalid email and/or password'] });
    }

    return res.status(400).send({ errors: ['Invalid email and/or password'] });
  }
}

export default new AuthMiddleware();
