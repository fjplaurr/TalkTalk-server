import supertest from 'supertest';
import { expect } from 'chai';
import path from 'path';
import fs from 'fs/promises';
import shortid from 'shortid';
import { createUser } from '@test/users/users.test';
import type { CreateUserPayload } from '@users/types/dto';
import { createJWT } from '@auth/auth.controller';
import app, { stopServer } from 'index';

export const request: supertest.SuperAgentTest = supertest.agent(app);

after(async () => {
  await stopServer();
});

const getCreateUserPayloadDefault: () => CreateUserPayload = () => ({
  email: `mockUser+${shortid.generate()}@mockUser.com`,
  password: 'mockUser',
  firstName: 'mockFirstName',
  lastName: 'mockLastName',
});

describe('me endpoints', () => {
  describe('PATCH to /me/avatar', () => {
    it('updates the avatar', async () => {
      const createUserResponse = await createUser(
        getCreateUserPayloadDefault()
      );

      const validToken = createJWT({ userId: createUserResponse.body.id });

      const filePath = path.join(__dirname, 'dog.jpg');

      const buffer = await fs.readFile(filePath);

      const updateAvatarResponse = await request
        .patch('/me/avatar')
        .set('Authorization', `Bearer ${validToken}`)
        .attach('avatar', buffer, filePath);

      expect(updateAvatarResponse.status).to.equal(200);
    });

    it('gets a 401 for a token not starting with Bearer', async () => {
      const invalidToken = 'invalid token';

      const filePath = path.join(__dirname, 'dog.jpg');

      const buffer = await fs.readFile(filePath);

      const updateAvatarResponse = await request
        .patch('/me/avatar')
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
        .patch('/me/avatar')
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
        .patch('/me/avatar')
        .attach('avatar', buffer, filePath);

      expect(updateAvatarResponse.status).to.equal(401);
    });

    it('gets a 404 if the user is not found', async () => {
      const validToken = createJWT({ userId: 'nonexistentUserId' });
      const filePath = path.join(__dirname, 'dog.jpg');
      const buffer = await fs.readFile(filePath);
      const updateAvatarResponse = await request
        .patch('/me/avatar')
        .set('Authorization', `Bearer ${validToken}`)
        .attach('avatar', buffer, filePath);
      expect(updateAvatarResponse.status).to.equal(404);
      expect(updateAvatarResponse.body).to.have.property(
        'message',
        'Document not found'
      );
    });
  });

  describe('PATCH to /me/profile', () => {
    it('updates the profile successfully', async () => {
      const createUserResponse = await createUser(
        getCreateUserPayloadDefault()
      );

      const validToken = createJWT({ userId: createUserResponse.body.id });

      const updateProfileResponse = await request
        .patch('/me/profile')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          firstName: 'UpdatedFirstName',
          lastName: 'UpdatedLastName',
        });

      expect(updateProfileResponse.status).to.equal(200);
      expect(updateProfileResponse.body).to.have.property(
        'id',
        createUserResponse.body.id
      );
    });

    it('gets a 401 for a token not starting with Bearer', async () => {
      const invalidToken = 'invalid token';

      const updateProfileResponse = await request
        .patch('/me/profile')
        .set('Authorization', invalidToken)
        .send({
          firstName: 'UpdatedFirstName',
          lastName: 'UpdatedLastName',
        });

      expect(updateProfileResponse.status).to.equal(401);
    });

    it('gets a 401 for an invalid token starting with Bearer', async () => {
      const invalidToken = 'Bearer invalid token';

      const updateProfileResponse = await request
        .patch('/me/profile')
        .set('Authorization', invalidToken)
        .send({
          firstName: 'UpdatedFirstName',
          lastName: 'UpdatedLastName',
        });

      expect(updateProfileResponse.status).to.equal(401);
    });

    it('gets a 401 if there is not a token attached to the authorization header', async () => {
      const updateProfileResponse = await request.patch('/me/profile').send({
        firstName: 'UpdatedFirstName',
        lastName: 'UpdatedLastName',
      });

      expect(updateProfileResponse.status).to.equal(401);
    });

    it('gets a 404 if the user is not found', async () => {
      const validToken = createJWT({ userId: 'nonexistentUserId' });

      const updateProfileResponse = await request
        .patch('/me/profile')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          firstName: 'UpdatedFirstName',
          lastName: 'UpdatedLastName',
        });

      expect(updateProfileResponse.status).to.equal(404);
      expect(updateProfileResponse.body).to.have.property(
        'message',
        'Document not found'
      );
    });

    it('gets a 304 if no changes are made to the profile', async () => {
      const createUserPayload = getCreateUserPayloadDefault();

      const createUserResponse = await createUser(createUserPayload);

      const validToken = createJWT({ userId: createUserResponse.body.id });

      const updateProfileResponse = await request
        .patch('/me/profile')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          firstName: createUserPayload.firstName,
          lastName: createUserPayload.lastName,
        });

      expect(updateProfileResponse.status).to.equal(304);
    });
  });
});
