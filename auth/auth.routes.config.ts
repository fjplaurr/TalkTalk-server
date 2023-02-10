import express from 'express';
import { body } from 'express-validator';
import authController from './auth.controller';
import authMiddleware from './middleware/auth.middleware';
import jwtMiddleware from './middleware/jwt.middleware';
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';

const router = express.Router();

router.post('/', [
  body('email').isEmail(),
  body('password').isString(),
  BodyValidationMiddleware.verifyBodyFieldsErrors,
  authMiddleware.verifyUserPassword,
  authController.createJWT,
]);

router.post('/refresh-token', [
  jwtMiddleware.validJWTNeeded,
  jwtMiddleware.verifyRefreshBodyField,
  jwtMiddleware.validRefreshNeeded,
  authController.createJWT,
]);

export default router;
