import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const jwtSecret: string = process.env.AUTHENTICATION_SECRET_KEY!;
const tokenExpirationInSeconds = 36000;

class AuthController {
  async createJWT(req: Request, res: Response) {
    try {
      const token = jwt.sign(req.body, jwtSecret, {
        expiresIn: tokenExpirationInSeconds,
      });
      return res.status(201).send({ accessToken: token });
    } catch (err) {
      console.log('createJWT error: ', err);
      return res.status(500).send({ errors: err });
    }
  }
}

export default new AuthController();
