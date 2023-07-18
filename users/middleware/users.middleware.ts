import express from 'express';
import UsersService from '../users.service';
import { body } from 'express-validator';

class UsersMiddleware {
  async validateSameEmailDoesntExist(email: string) {
    const user = await UsersService.getUserByEmail(email);
    if (user) {
      throw new Error(`User email already exists`);
    }
  }

  createBodyValidations = [
    body('email')
      .isEmail()
      .custom((email) => this.validateSameEmailDoesntExist(email)),
    body('password')
      .isStrongPassword({
        minLength: 6,
        minNumbers: 0,
        minSymbols: 0,
      })
      .withMessage(
        'Please use a password that is at least 6 characters long and includes both lowercase and uppercase letters.'
      ),
  ];

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
