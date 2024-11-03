import supertest from 'supertest';
import { expect } from 'chai';
import shortid from 'shortid';
import type { User } from '@users/types/users';
import app, { stopServer } from 'index';

export const request: supertest.SuperAgentTest = supertest.agent(app);

after(async () => {
  await stopServer();
});

export type SignupPayload = Pick<
  User,
  'password' | 'email' | 'firstName' | 'lastName'
>;

const signupPayload: SignupPayload = {
  email: `mockUser+${shortid.generate()}@mockUser.com`,
  password: 'mockUser',
  firstName: 'mockFirstName',
  lastName: 'mockLastName',
};

export type LoginPayload = Pick<User, 'password' | 'email'>;

export const signup = async (body: SignupPayload) =>
  request.post('/auth/signup').send(body);

export const login = async (body: LoginPayload) =>
  request.post('/auth/login').send(body);

describe('auth endpoints', () => {
  describe('POST to /signup', () => {
    it('successfully signs up a new user', async () => {
      const signupResponse = await signup(signupPayload);

      const { user, accessToken } = signupResponse.body;

      expect(user.email).to.equal(signupPayload.email);
      expect(user.firstName).to.equal(signupPayload.firstName);
      expect(user.lastName).to.equal(signupPayload.lastName);
      expect(signupResponse.status).to.equal(201);
      expect(accessToken).to.be.a('string');
    });

    it('fails to sign up with an already registered email', async () => {
      await signup(signupPayload);

      const duplicateSignupResponse = await signup(signupPayload);

      expect(duplicateSignupResponse.status).to.equal(400);
    });

    it('fails to sign up if the email is invalid', async () => {
      await signup(signupPayload);

      const signupPayloadWithoutEmail = {
        ...signupPayload,
        email: 'invalid email',
      };

      const signupResponse = await signup(signupPayloadWithoutEmail);

      expect(signupResponse.status).to.equal(400);
    });

    it('fails to sign up if the email is invalid', async () => {
      await signup(signupPayload);

      const signupPayloadWithoutEmail = {
        ...signupPayload,
        password: 'invalid password',
      };

      const signupResponse = await signup(signupPayloadWithoutEmail);

      expect(signupResponse.status).to.equal(400);
    });
  });
  describe('POST to /login', () => {
    it('logs in an existing user with user and password', async () => {
      await signup(signupPayload);

      const loginPayload: LoginPayload = {
        email: signupPayload.email,
        password: signupPayload.password,
      };

      const loginResponse = await login(loginPayload);

      const { user, accessToken } = loginResponse.body;

      expect(user.email).to.equal(signupPayload.email);
      expect(user.firstName).to.equal(signupPayload.firstName);
      expect(user.lastName).to.equal(signupPayload.lastName);
      expect(loginResponse.status).to.equal(201);
      expect(accessToken).to.be.a('string');
    });
  });
});
