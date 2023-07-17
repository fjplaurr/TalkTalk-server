import express from 'express';
import { body } from 'express-validator';
import authController from './auth.controller';
import authMiddleware from './middleware/auth.middleware';
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';

const router = express.Router();

router.post('/', [
  body('email').isEmail(),
  body('password').isString(),
  BodyValidationMiddleware.verifyBodyFieldsErrors,
  authMiddleware.verifyUserPassword,
  authController.createJWT,
]);

export default router;
