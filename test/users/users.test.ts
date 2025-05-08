import { expect } from 'chai';
import shortid from 'shortid';
import supertest from 'supertest';
import type { User } from '@users/types/users';
import type { CreateUserPayload, PatchUserPayload } from '@users/types/dto';
import app, { stopServer } from 'index';

export const request: supertest.SuperAgentTest = supertest.agent(app);

after(async () => {
  await stopServer();
});

export const createUserPayloadDefault: () => CreateUserPayload = () => ({
  email: `mockUser+${shortid.generate()}@mockUser.com`,
  password: 'mockUser',
  firstName: 'mockFirstName',
  lastName: 'mockLastName',
});

export const createUser = async (body: CreateUserPayload) =>
  request.post('/users').send(body);

describe('users endpoints', () => {
  describe('POST to /users', () => {
    it('creates an user and returns its id', async () => {
      const createUserResponse = await createUser(createUserPayloadDefault());

      expect(createUserResponse.status).to.equal(201);
      expect(createUserResponse.body.id).to.be.a('string');
    });

    it('returns an error if email is missing in the request body', async () => {
      const createUserPayload: CreateUserPayload = {
        email: '',
        firstName: 'mockFirstName',
        lastName: 'mockLastName',
        password: 'mockUser',
      };

      const createUserResponse = await createUser(createUserPayload);

      expect(createUserResponse.status).to.equal(400);
    });

    it('returns an error if password <6 chars in the request body', async () => {
      const createUserPayload: CreateUserPayload = {
        email: `mockUser+${shortid.generate()}@mockUser.com`,
        firstName: 'mockFirstName',
        lastName: 'mockLastName',
        password: 'fG45',
      };

      const res = await createUser(createUserPayload);

      expect(res.status).to.equal(400);
      expect(res.body.errors).to.be.an('array');
      expect(res.body.errors[0]).to.be.an('object');
      expect(res.body.errors[0]).to.have.property('msg');
      expect(res.body.errors[0].msg).to.equal(
        'Please use a password that is at least 6 characters long and includes both lowercase and uppercase letters'
      );
    });

    it('returns an error if password does not contain a lowercase letter', async () => {
      const createUserPayload: CreateUserPayload = {
        email: `mockUser+${shortid.generate()}@mockUser.com`,
        firstName: 'mockFirstName',
        lastName: 'mockLastName',
        password: 'MOCKUSER1!',
      };

      const res = await createUser(createUserPayload);

      expect(res.status).to.equal(400);
      expect(res.body.errors).to.be.an('array');
      expect(res.body.errors[0]).to.be.an('object');
      expect(res.body.errors[0]).to.have.property('msg');
      expect(res.body.errors[0].msg).to.equal(
        'Please use a password that is at least 6 characters long and includes both lowercase and uppercase letters'
      );
    });

    it('returns an error if password does not contain an uppercase letter', async () => {
      const createUserPayload: CreateUserPayload = {
        email: `mockUser+${shortid.generate()}@mockUser.com`,
        firstName: 'mockFirstName',
        lastName: 'mockLastName',
        password: 'mockuser1!',
      };

      const res = await createUser(createUserPayload);

      expect(res.status).to.equal(400);
      expect(res.body.errors).to.be.an('array');
      expect(res.body.errors[0]).to.be.an('object');
      expect(res.body.errors[0]).to.have.property('msg');
      expect(res.body.errors[0].msg).to.equal(
        'Please use a password that is at least 6 characters long and includes both lowercase and uppercase letters'
      );
    });

    it('returns an error if the email already exists', async () => {
      const createUserPayload: CreateUserPayload = {
        email: `mockUser+${shortid.generate()}@mockUser.com`,
        password: 'mockUser',
        firstName: 'mockFirstName',
        lastName: 'mockLastName',
      };
      await createUser(createUserPayload);

      const createRepeatedUserResponse = await createUser(createUserPayload);

      const found = createRepeatedUserResponse.body.errors?.some(
        (error: { msg: string }) => error.msg === 'Email already exists'
      );

      expect(createRepeatedUserResponse.status).to.equal(400);
      expect(found).to.be.true;
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
