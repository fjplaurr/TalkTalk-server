import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Jwt } from '../../common/types/jwt';
import usersService from '../../users/users.service';

const jwtSecret: string = process.env.AUTHENTICATION_SECRET_KEY!;

class JwtMiddleware {
  verifyRefreshBodyField(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.body && req.body.refreshToken) {
      return next();
    }
    return res
      .status(400)
      .send({ errors: ['Missing required field: refreshToken'] });
  }

  validJWTNeeded(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.headers.authorization) {
      try {
        const authorization = req.headers.authorization.split(' ');
        if (authorization[0] !== 'Bearer') {
          return res.status(401).send();
        }
        res.locals.jwt = jwt.verify(authorization[1], jwtSecret) as Jwt;
        return next();
      } catch (err) {
        console.log('err: ', err);
        return res.status(403).send();
      }
    } else {
      return res.status(401).send();
    }
  }

  async validRefreshNeeded(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user: any = await usersService.getUserByEmailWithPassword(
      res.locals.jwt.email
    );
    const salt = crypto.createSecretKey(
      Buffer.from(res.locals.jwt.refreshKey.data)
    );
    const hash = crypto
      .createHmac('sha512', salt)
      .update(res.locals.jwt.userId + jwtSecret)
      .digest('base64');
    if (hash === req.body.refreshToken) {
      req.body = {
        userId: user._id,
        email: user.email,
        permissionFlags: user.permissionFlags,
      };
      return next();
    }
    return res.status(400).send({ errors: ['Invalid refresh token'] });
  }
}

export default new JwtMiddleware();
