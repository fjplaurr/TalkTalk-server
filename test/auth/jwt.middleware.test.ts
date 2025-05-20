import express from 'express';
import { expect } from 'chai';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import jwtMiddleware from '@auth/middleware/jwt.middleware';

const app = express();
app.get('/protected', jwtMiddleware.validJWTNeeded, (req, res) => {
  res.status(200).json({ message: 'Access granted' });
});

const request = supertest(app);
const jwtSecret = process.env.AUTHENTICATION_SECRET_KEY!;

describe('validJWTNeeded middleware', () => {
  it('returns 401 if Authorization header is missing', async () => {
    const res = await request.get('/protected');
    expect(res.status).to.equal(401);
  });

  it('returns 401 if Authorization header does not have the pattern Bearer <token>', async () => {
    const res = await request
      .get('/protected')
      .set('Authorization', 'BadToken');
    expect(res.status).to.equal(401);
  });

  it('returns 401 if JWT token is invalid', async () => {
    const originalConsoleError = console.error;
    console.error = () => {};
    const res = await request
      .get('/protected')
      .set('Authorization', 'Bearer invalidtoken');
    expect(res.status).to.equal(401);
    console.error = originalConsoleError;
  });

  it('returns 200 if JWT token is valid', async () => {
    const token = jwt.sign({ userId: 'test' }, jwtSecret);
    const res = await request
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Access granted');
  });
});
