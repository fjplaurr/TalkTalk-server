import express from 'express';
import { body } from 'express-validator';
import AuthController from './auth.controller';
import authMiddleware from './middleware/auth.middleware';
import usersMiddleware from '../users/middleware/users.middleware';
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';
import JwtMiddleware from './middleware/jwt.middleware';

const router = express.Router();

router.post('/loginWithEmailAndPassword', [
  body('email').isEmail(),
  body('password').isString(),
  BodyValidationMiddleware.validateRequest,
  authMiddleware.verifyUserPassword,
  AuthController.createAccessToken,
]);

router.post('/loginWithToken', [
  JwtMiddleware.validJWTNeeded,
  AuthController.createAccessToken,
]);

router.post('/signup', [
  ...usersMiddleware.createBodyValidations,
  BodyValidationMiddleware.validateRequest,
  AuthController.signup,
]);

export default router;
