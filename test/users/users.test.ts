import { expect } from 'chai';
import shortid from 'shortid';
import supertest from 'supertest';
import type { User } from '@users/types/users';
import type { PatchUserPayload } from '@users/types/dto';
import app, { stopServer } from 'index';
import { createUser } from '@test/utils';

export const request: supertest.SuperAgentTest = supertest.agent(app);

after(async () => {
  await stopServer();
});

describe('users endpoints', () => {
  describe('GET from /users/:userId', () => {
    it('returns an user', async () => {
      const { id } = await createUser();

      const getUserResponse = await request.get(`/users/${id}`).send();

      expect(getUserResponse.body._id).to.equal(id);
      expect(getUserResponse.status).to.equal(200);
    });

    it('returns an empty object if the user does not exist', async () => {
      const res = await request.get(`/users/${shortid.generate()}`).send();

      expect(res.status).to.equal(200);
      expect(res.body).to.be.empty;
    });
  });

  describe('GET from /users', () => {
    it('returns all the users', async () => {
      const { id } = await createUser();

      const res = await request.get(`/users`).send();

      const found = res.body.some((user: User) => user._id === id);

      expect(res.status).to.equal(200);
      expect(found).to.be.ok;
    });
  });
});
