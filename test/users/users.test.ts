import { expect } from 'chai';
import shortid from 'shortid';
import supertest from 'supertest';
import { User } from '../../users/types/users';
import { CreateUserPayload, PatchUserPayload } from '../../users/types/dto';
// import { stopServer } from '../../server';
import app, { stopServer } from '../../index';

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

export const createUser = async (body: CreateUserPayload) =>
  request.post('/users').send(body);

describe('users endpoints', () => {
  describe('POST to /users', () => {
    it('creates an user and returns its id', async () => {
      const createUserResponse = await createUser(createUserPayloadDefault);

      expect(createUserResponse.status).to.equal(201);
      expect(createUserResponse.body.id).to.be.a('string');
    });

    it('returns an error if email is missing in the request body', async () => {
      const createUserResponse = await createUser(createUserPayloadDefault);

      expect(createUserResponse.status).to.equal(400);
      expect(createUserResponse.error).to.be.ok;
    });

    it('returns an error if password is missing in the request body', async () => {
      const res = await createUser(createUserPayloadDefault);

      expect(res.status).to.equal(400);
      expect(res.error).to.be.ok;
    });
  });

  describe('GET from /users/:userId', () => {
    it('returns an user', async () => {
      const createUserPayload: CreateUserPayload = {
        email: `mockUser+${shortid.generate()}@mockUser.com`,
        password: 'mockUser',
        firstName: 'mockFirstName',
        lastName: 'mockLastName',
      };

      const createUserResponse = await createUser(createUserPayload);

      expect(createUserResponse.status).to.equal(201);

      const getUserResponse = await request
        .get(`/users/${createUserResponse.body.id}`)
        .send();

      expect(getUserResponse.body._id).to.equal(createUserResponse.body.id);
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
      const email = `mockUser+${shortid.generate()}@mockUser.com`;

      const createUserPayload: CreateUserPayload = {
        email,
        password: 'mockUser',
        firstName: 'mockFirstName',
        lastName: 'mockLastName',
      };

      await createUser(createUserPayload);
      const res = await request.get(`/users`).send();

      const found = res.body.some((user: User) => user.email === email);

      expect(res.status).to.equal(200);
      expect(found).to.be.ok;
    });
  });

  describe('PATCH to /users/:userId', () => {
    it('patches an user and returns a 200 status code', async () => {
      const patchUserPayload: PatchUserPayload = {
        firstName: 'mockUser',
      };

      const createUserPayload: CreateUserPayload = {
        email: `mockUser+${shortid.generate()}@mockUser.com`,
        password: 'mockUser',
        firstName: 'mockFirstName',
        lastName: 'mockLastName',
      };

      const createUserResponse = await createUser(createUserPayload);

      const res = await request
        .patch(`/users/${createUserResponse.body.id}`)
        .send(patchUserPayload);

      expect(res.status).to.equal(204);
    });

    it('does not patch a non existing user and returns a 404 status code', async () => {
      const patchUserPayload: PatchUserPayload = {
        firstName: 'mockUser',
      };

      const res = await request
        .patch(`/users/${shortid.generate()}`)
        .send(patchUserPayload);

      expect(res.status).to.equal(404);
    });
  });

  describe('DELETE to /users/:userId', () => {
    it('deletes an user and returns a 204 status code', async () => {
      const createUserPayload: CreateUserPayload = {
        email: `mockUser+${shortid.generate()}@mockUser.com`,
        password: 'mockUser',
        firstName: 'mockFirstName',
        lastName: 'mockLastName',
      };

      const createUserResponse = await createUser(createUserPayload);

      const deleteUserResponse = await request
        .delete(`/users/${createUserResponse.body.id}`)
        .send();

      const getUserResponse = await request
        .get(`/users/${createUserResponse.body.id}`)
        .send();

      expect(getUserResponse.body).to.be.empty;
      expect(deleteUserResponse.status).to.equal(204);
    });
  });
});
