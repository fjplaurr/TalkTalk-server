import type express from 'express';
import jwt from 'jsonwebtoken';

const jwtSecret: string = process.env.AUTHENTICATION_SECRET_KEY!;

class JwtMiddleware {
  validJWTNeeded(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).send();
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).send();
    }

    try {
      res.locals.jwt = jwt.verify(token, jwtSecret);
      return next();
    } catch (err) {
      console.error('JWT verification error:', err);
      return res.status(401).send();
    }
  }
}

export default new JwtMiddleware();
