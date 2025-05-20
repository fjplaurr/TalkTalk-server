import supertest from 'supertest';
import { expect } from 'chai';
import path from 'path';
import fs from 'fs/promises';
import { createJWT } from '@auth/auth.controller';
import app, { stopServer } from 'index';
import { createUser } from '@test/utils';

export const request: supertest.SuperAgentTest = supertest.agent(app);

after(async () => {
  await stopServer();
});

describe('me endpoints', () => {
  describe('PATCH to /me/avatar', () => {
    it('updates the avatar', async () => {
      const { id } = await createUser();

      const validToken = createJWT({ userId: id });

      const filePath = path.join(__dirname, 'dog.jpg');

      const buffer = await fs.readFile(filePath);

      const updateAvatarResponse = await request
        .patch('/me/avatar')
        .set('Authorization', `Bearer ${validToken}`)
        .attach('avatar', buffer, filePath);

      expect(updateAvatarResponse.status).to.equal(200);
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
      const { id } = await createUser();

      const validToken = createJWT({ userId: id });

      const updateProfileResponse = await request
        .patch('/me/profile')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          firstName: 'UpdatedFirstName',
          lastName: 'UpdatedLastName',
        });

      expect(updateProfileResponse.status).to.equal(200);
      expect(updateProfileResponse.body).to.have.property('id', id);
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
      const { id, createUserPayload } = await createUser();

      const validToken = createJWT({ userId: id });

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

  describe('DELETE to /me', () => {
    it('deletes the current user and returns a 204 status code', async () => {
      const { id } = await createUser();

      const validToken = createJWT({ userId: id });

      const deleteUserResponse = await request
        .delete('/me')
        .set('Authorization', `Bearer ${validToken}`)
        .send();

      expect(deleteUserResponse.status).to.equal(204);
    });
  });
});
