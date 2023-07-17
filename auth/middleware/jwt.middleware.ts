import express from 'express';
import jwt from 'jsonwebtoken';
import { Jwt } from '../../common/types/jwt';

const jwtSecret: string = process.env.AUTHENTICATION_SECRET_KEY!;

class JwtMiddleware {
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
}

export default new JwtMiddleware();
