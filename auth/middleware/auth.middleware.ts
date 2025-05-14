import type express from 'express';
import type { Response } from 'express';
import argon2 from 'argon2';
import usersService from '@users/users.service';
import type { User } from '@users/types/users';

export type AuthMiddlewareLocals = Response['locals'] & {
  user: User;
};
class AuthMiddleware {
  async verifyUserPassword(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
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

  async adminOnlyMiddleware(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const { user } = res.locals as AuthMiddlewareLocals;

    if (user.role === 'admin') {
      return next();
    }

    return res.status(403).send({ errors: ['Admin access required'] });
  }
}

export default new AuthMiddleware();
