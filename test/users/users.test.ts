import { expect } from 'chai';
import shortid from 'shortid';
import supertest from 'supertest';
import type { User } from '@users/types/users';
import app, { stopServer } from 'index';
import { createUser } from '@test/utils';
import { getSignupPayload, signup } from '@test/auth/auth.test';

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

  describe('POST from /users/:id/follow', () => {
    it('follows a user', async () => {
      // signup a follower user
      const signupPayload = getSignupPayload();
      const signupResponse = await signup(signupPayload);
      const { accessToken } = signupResponse.body;

      // signup a followed user
      const signupPayloadForFollowed = getSignupPayload();
      const signupResponseForFollowed = await signup(signupPayloadForFollowed);
      const { user: followedUser } = signupResponseForFollowed.body;

      const res = await request
        .post(`/users/${followedUser._id}/follow`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send();

      expect(res.status).to.equal(204);
    });

    it('returns 404 if the user to follow does not exist', async () => {
      // signup a follower user
      const signupPayload = getSignupPayload();
      const signupResponse = await signup(signupPayload);
      const { accessToken } = signupResponse.body;

      const res = await request
        .post(`/users/${shortid.generate()}/follow`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send();

      expect(res.status).to.equal(404);
    });

    it('returns 400 if the user tries to follow themselves', async () => {
      // signup a follower user
      const signupPayload = getSignupPayload();
      const signupResponse = await signup(signupPayload);
      const { accessToken, user } = signupResponse.body;

      const res = await request
        .post(`/users/${user._id}/follow`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send();

      expect(res.status).to.equal(400);
    });
  });

  describe('GET from /users/:id/following', () => {
    it('returns the following users', async () => {
      // signup a follower user
      const signupPayload = getSignupPayload();
      const signupResponse = await signup(signupPayload);
      const { accessToken } = signupResponse.body;

      // signup a followed user
      const signupPayloadForFollowed = getSignupPayload();
      const signupResponseForFollowed = await signup(signupPayloadForFollowed);
      const { user: followedUser } = signupResponseForFollowed.body;

      await request
        .post(`/users/${followedUser._id}/follow`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send();

      const res = await request
        .get(`/users/${signupResponse.body.user._id}/following`)
        .send();

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.include(followedUser._id);
    });
  });
});
