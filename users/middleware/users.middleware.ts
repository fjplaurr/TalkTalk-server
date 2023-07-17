import express from 'express';
import UsersService from '../users.service';

class UsersMiddleware {
  async validateSameEmailDoesntExist(email: string) {
    const user = await UsersService.getUserByEmail(email);
    if (user) {
      throw new Error(`User email already exists`);
    }
  }

  async extractUserId(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    req.body.id = req.params.userId;
    next();
  }
}

export default new UsersMiddleware();
