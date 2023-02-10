import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const jwtSecret: string = process.env.AUTHENTICATION_SECRET_KEY!;
const tokenExpirationInSeconds = 36000;

class AuthController {
  async createJWT(req: Request, res: Response) {
    try {
      const refreshId = req.body.userId + jwtSecret;
      const salt = crypto.createSecretKey(crypto.randomBytes(16));
      const hash = crypto
        .createHmac('sha512', salt)
        .update(refreshId)
        .digest('base64');
      req.body.refreshKey = salt.export();
      const token = jwt.sign(req.body, jwtSecret, {
        expiresIn: tokenExpirationInSeconds,
      });
      return res.status(201).send({ accessToken: token, refreshToken: hash });
    } catch (err) {
      console.log('createJWT error: ', err);
      return res.status(500).send({ errors: err });
    }
  }
}

export default new AuthController();
