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

type GetSignupPayload = () => SignupPayload;
export const getSignupPayload: GetSignupPayload = () => ({
  email: `mockUser+${shortid.generate()}@mockUser.com`,
  password: 'mockUser',
  firstName: 'mockFirstName',
  lastName: 'mockLastName',
});

export type LoginPayload = Pick<User, 'password' | 'email'>;

export const signup = async (body: SignupPayload) =>
  request.post('/auth/signup').send(body);

export const login = async (body: LoginPayload) =>
  request.post('/auth/login').send(body);

describe('auth endpoints', () => {
  describe('POST to /signup', () => {
    it('successfully signs up a new user', async () => {
      const signupPayload = getSignupPayload();
      const signupResponse = await signup(signupPayload);

      const { user, accessToken } = signupResponse.body;

      expect(user.email).to.equal(signupPayload.email);
      expect(user.firstName).to.equal(signupPayload.firstName);
      expect(user.lastName).to.equal(signupPayload.lastName);
      expect(signupResponse.status).to.equal(201);
      expect(accessToken).to.be.a('string');
    });

    it('fails to sign up with an already registered email', async () => {
      const signupPayload = getSignupPayload();
      await signup(signupPayload);

      const duplicateSignupResponse = await signup(signupPayload);

      const found = duplicateSignupResponse.body.errors?.some(
        (error: { msg: string }) => error.msg === 'Email already exists'
      );

      expect(duplicateSignupResponse.status).to.equal(400);
      expect(found).to.be.true;
    });

    it('fails to sign up if the email is invalid', async () => {
      const signupPayload = getSignupPayload();
      await signup(signupPayload);

      const signupPayloadWithoutEmail = {
        ...signupPayload,
        email: 'invalid email',
      };

      const signupResponse = await signup(signupPayloadWithoutEmail);

      expect(signupResponse.status).to.equal(400);
    });

    it('fails to sign up if the password is invalid', async () => {
      const signupPayload = getSignupPayload();
      await signup(signupPayload);

      const signupPayloadWithoutPassword = {
        ...signupPayload,
        password: 'invalid password',
      };

      const signupResponse = await signup(signupPayloadWithoutPassword);

      expect(signupResponse.status).to.equal(400);
    });

    it('returns an error if password <6 chars in the request body', async () => {
      const signupPayload = { ...getSignupPayload(), password: 'fG45' };

      const res = await signup(signupPayload);

      expect(res.status).to.equal(400);
      expect(res.body.errors).to.be.an('array');
      expect(res.body.errors[0]).to.be.an('object');
      expect(res.body.errors[0]).to.have.property('msg');
      expect(res.body.errors[0].msg).to.equal(
        'Please use a password that is at least 6 characters long and includes both lowercase and uppercase letters'
      );
    });

    it('returns an error if password does not contain a lowercase letter', async () => {
      const signupPayload = { ...getSignupPayload(), password: 'MOCKUSER1!' };
      const res = await signup(signupPayload);
      expect(res.status).to.equal(400);
      expect(res.body.errors).to.be.an('array');
      expect(res.body.errors[0]).to.be.an('object');
      expect(res.body.errors[0]).to.have.property('msg');
      expect(res.body.errors[0].msg).to.equal(
        'Please use a password that is at least 6 characters long and includes both lowercase and uppercase letters'
      );
    });

    it('returns an error if password does not contain an uppercase letter', async () => {
      const signupPayload = { ...getSignupPayload(), password: 'mockuser1!' };
      const res = await signup(signupPayload);
      expect(res.status).to.equal(400);
      expect(res.body.errors).to.be.an('array');
      expect(res.body.errors[0]).to.be.an('object');
      expect(res.body.errors[0]).to.have.property('msg');
      expect(res.body.errors[0].msg).to.equal(
        'Please use a password that is at least 6 characters long and includes both lowercase and uppercase letters'
      );
    });
  });
  describe('POST to /login', () => {
    it('logs in an existing user with user and password', async () => {
      const signupPayload = getSignupPayload();
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
