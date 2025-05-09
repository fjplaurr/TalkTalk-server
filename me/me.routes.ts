import express from 'express';
import MeController from './me.controller';
import jwtMiddleware from '../auth/middleware/jwt.middleware';

const router = express.Router();

router.patch('/avatar', [
  jwtMiddleware.validJWTNeeded,
  MeController.updateAvatar,
]);

router.patch('/profile', [
  jwtMiddleware.validJWTNeeded,
  MeController.updateProfile,
]);

router.delete('/', jwtMiddleware.validJWTNeeded, MeController.deleteProfile);

export default router;
