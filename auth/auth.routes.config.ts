import express from 'express';
import { body } from 'express-validator';
import usersMiddleware from '@users/middleware/users.middleware';
import AuthController from './auth.controller';
import authMiddleware from './middleware/auth.middleware';
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';

const router = express.Router();

router.post('/login', [
  body('email').isEmail(),
  body('password').isString(),
  BodyValidationMiddleware.validateRequest,
  authMiddleware.verifyUserPassword,
  AuthController.login,
]);

router.post('/signup', [
  ...usersMiddleware.createBodyValidations,
  AuthController.signup,
]);

export default router;
