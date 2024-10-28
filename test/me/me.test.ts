import supertest from 'supertest';
import { expect } from 'chai';
import path from 'path';
import fs from 'fs/promises';
import shortid from 'shortid';
import app, { stopServer } from '../../index';
import { createJWT } from '../../auth/auth.controller';
import { createUser } from '../users/users.test';
import { CreateUserPayload } from '../../users/types/dto';

export const request: supertest.SuperAgentTest = supertest.agent(app);

after(async () => {
  await stopServer();
});

const createUserPayloadDefault: CreateUserPayload = {
  email: `mockUser+${shortid.generate()}@mockUser.com`,
  password: 'mockUser',
  firstName: 'mockFirstName',
  lastName: 'mockLastName',
};

describe('me endpoints', () => {
  describe('POST to /me/avatar', () => {
    it('updates the avatar', async () => {
      const createUserResponse = await createUser(createUserPayloadDefault);

      const validToken = createJWT({ userId: createUserResponse.body.id });

      const filePath = path.join(__dirname, 'dog.jpg');

      const buffer = await fs.readFile(filePath);

      const updateAvatarResponse = await request
        .post('/me/avatar')
        .set('Authorization', `Bearer ${validToken}`)
        .attach('avatar', buffer, filePath);

      expect(updateAvatarResponse.status).to.equal(200);
    });

    it('gets a 401 for a token not starting with Bearer', async () => {
      const invalidToken = 'invalid token';

      const filePath = path.join(__dirname, 'dog.jpg');

      const buffer = await fs.readFile(filePath);

      const updateAvatarResponse = await request
        .post('/me/avatar')
        .set('Authorization', invalidToken)
        .attach('avatar', buffer, filePath);

      expect(updateAvatarResponse.status).to.equal(401);
    });

    it('gets a 401 for an invalid token starting with Bearer', async () => {
      const invalidToken = 'Bearer invalid token';

      const filePath = path.join(__dirname, 'dog.jpg');

      const buffer = await fs.readFile(filePath);

      // Override console.error ot prevent output from appearing in the console
      const originalConsoleError = console.error;
      console.error = () => {};

      const updateAvatarResponse = await request
        .post('/me/avatar')
        .set('Authorization', invalidToken)
        .attach('avatar', buffer, filePath);

      console.error = originalConsoleError;

      expect(updateAvatarResponse.status).to.equal(401);
    });

    it('gets a 401 if there is not a token attached to the authorization header', async () => {
      console.error('this is the message for the last test');
      const filePath = path.join(__dirname, 'dog.jpg');

      const buffer = await fs.readFile(filePath);

      const updateAvatarResponse = await request
        .post('/me/avatar')
        .attach('avatar', buffer, filePath);

      expect(updateAvatarResponse.status).to.equal(401);
    });
  });
});
