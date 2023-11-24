import express from 'express';
import MeController from './me.controller';
import JwtMiddleware from '../auth/middleware/jwt.middleware';

const router = express.Router();

router.post('/avatar', [
  JwtMiddleware.validJWTNeeded,
  MeController.updateAvatar,
]);

router.patch('/profile', [
  JwtMiddleware.validJWTNeeded,
  MeController.updateProfile,
]);

export default router;
