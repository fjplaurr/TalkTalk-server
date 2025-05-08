import { expect } from 'chai';
import shortid from 'shortid';
import supertest from 'supertest';
import type { Post } from '@posts/types/posts';
import type { PatchPostPayload, CreatePostPayload } from '@posts/types/dto';
import app, { stopServer } from 'index';
import { signup, getSignupPayload } from '@test/auth/auth.test';

export const request: supertest.SuperAgentTest = supertest.agent(app);

const MOCK_TEXT = 'mockText';
const MOCK_AUTHOR_ID = 'mockAuthorId';
const MOCK_DATE = new Date('2023-07-19T23:15:30.000Z');

const createPostPayloadDefault: () => CreatePostPayload = () => ({
  text: MOCK_TEXT,
  authorId: MOCK_AUTHOR_ID,
  date: MOCK_DATE,
});

let accessToken: string;

before(async () => {
  const signupPayload = getSignupPayload();
  const signupResponse = await signup(signupPayload);
  accessToken = signupResponse.body.accessToken;
});

after(async () => {
  await stopServer();
});

const createPost = async (body: CreatePostPayload) =>
  request
    .post('/posts')
    .send(body)
    .set('Authorization', `Bearer ${accessToken}`);

const getPost = async (id: string) =>
  request
    .get(`/posts/${id}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send();

describe('Posts Endpoints', () => {
  describe('POST /posts', () => {
    it('should create a post and return its ID', async () => {
      const createPostResponse = await createPost(createPostPayloadDefault());

      expect(createPostResponse.status).to.equal(201);
      expect(createPostResponse.body.id).to.be.a('string');
    });
  });

  describe('GET /posts/:id', () => {
    it('should return a post by ID', async () => {
      const createPostResponse = await createPost(createPostPayloadDefault());

      const res = await getPost(createPostResponse.body.id);

      expect(res.status).to.equal(200);
      expect(res.body._id).to.equal(createPostResponse.body.id);
    });

    it('should return an empty object for a non-existent post', async () => {
      const res = await getPost(shortid.generate());

      expect(res.status).to.equal(200);
      expect(res.body).to.be.empty;
    });
  });

  describe('GET /posts', () => {
    it('should return all posts', async () => {
      const randomText = shortid.generate();
      const createPostPayload: CreatePostPayload = {
        ...createPostPayloadDefault(),
        text: randomText,
      };

      await createPost(createPostPayload);

      const res = await request
        .get('/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send();

      const found = res.body.some((post: Post) => post.text === randomText);

      expect(res.status).to.equal(200);
      expect(found).to.be.true;
    });
  });

  describe('PATCH /posts/:id', () => {
    it('should patch a post and return a 200 status code', async () => {
      const patchPostPayload: PatchPostPayload = {
        text: 'mockTextModified',
      };

      const createPostResponse = await createPost(createPostPayloadDefault());

      const res = await request
        .patch(`/posts/${createPostResponse.body.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(patchPostPayload);

      expect(res.status).to.equal(200);
    });

    it('should return a 404 status code for a non-existent post', async () => {
      const patchPostPayload: PatchPostPayload = {
        text: MOCK_TEXT,
      };

      const res = await request
        .patch(`/posts/${shortid.generate()}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(patchPostPayload);

      expect(res.status).to.equal(404);
    });
  });

  describe('DELETE /posts/:id', () => {
    it('should delete a post and return a 204 status code', async () => {
      const createPostResponse = await createPost(createPostPayloadDefault());

      const deleteResponse = await request
        .delete(`/posts/${createPostResponse.body.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send();

      const getResponse = await getPost(createPostResponse.body.id);

      expect(deleteResponse.status).to.equal(204);
      expect(getResponse.body).to.be.empty;
    });
  });
});
