import { body } from 'express-validator';
import UsersService from '@users/users.service';
import BodyValidationMiddleware from '@common/middleware/body.validation.middleware';

class UsersMiddleware {
  async validateSameEmailDoesntExist(email: string): Promise<void> {
    const user = await UsersService.getUserByEmail(email);
    if (user) {
      throw new Error(`Email already exists`);
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
        minUppercase: 1,
        minLowercase: 1,
      })
      .withMessage(
        'Please use a password that is at least 6 characters long and includes both lowercase and uppercase letters'
      ),
    body('firstName').isString(),
    body('lastName').isString(),
    BodyValidationMiddleware.validateRequest,
  ];
}

export default new UsersMiddleware();
