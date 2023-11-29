import supertest from 'supertest';
import { expect } from 'chai';
import shortid from 'shortid';
import app from '../../index';
import MongoDbService from '../../common/services/mongodb/mongodb.service';
import { User } from '../../users/types/users';
import { PatchUserPayload, CreateUserPayload } from '../../users/types/dto';

describe('users endpoints', () => {
  const request: supertest.SuperAgentTest = supertest.agent(app);

  const createUser = async (body: CreateUserPayload) =>
    request.post('/users').send(body);

  describe('POST to /users', () => {
    it('creates an user and returns its id', async () => {
      const createUserPayload: CreateUserPayload = {
        email: `mockUser+${shortid.generate()}@mockUser.com`,
        password: 'mockUser',
        firstName: 'mockFirstName',
        lastName: 'mockLastName',
      };

      const res = await createUser(createUserPayload);

      expect(res.status).to.equal(201);
      expect(res.body.id).to.be.a('string');
    });

    it('returns an error if email is missing in the request body', async () => {
      const createUserPayload: any = {
        password: 'mockUser',
      };

      const res = await createUser(createUserPayload);

      expect(res.status).to.equal(400);
      expect(res.error).to.be.ok;
    });

    it('returns an error if password is missing in the request body', async () => {
      const createUserPayload: any = {
        email: `mockUser+${shortid.generate()}@mockUser.com`,
      };

      const res = await createUser(createUserPayload);

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

      const res = await request
        .get(`/users/${createUserResponse.body.id}`)
        .send();

      expect(res.status).to.equal(200);
      expect(res.body._id).to.equal(createUserResponse.body.id);
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

    it('returns an empty array if there are no users', async () => {
      await MongoDbService.dropCollection();
      await MongoDbService.createCollection('users');

      const res = await request.get(`/users`).send();

      expect(res.body.length).to.equal(0);
      expect(res.status).to.equal(200);
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

      expect(res.status).to.equal(200);
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
