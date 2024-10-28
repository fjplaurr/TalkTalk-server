import express from 'express';
import jwt from 'jsonwebtoken';

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
        res.locals.jwt = jwt.verify(authorization[1], jwtSecret);
        return next();
      } catch (err) {
        console.error('JWT verification error:', err);
        return res.status(401).send();
      }
    }
    return res.status(401).send();
  }
}

export default new JwtMiddleware();
