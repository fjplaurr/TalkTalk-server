import supertest from 'supertest';
import { expect } from 'chai';
import shortid from 'shortid';
import app from '../../index';
import MongoDbService from '../../common/services/mongodb/mongodb.service';
import { Post } from '../../posts/types/posts';
import { PatchPostPayload, CreatePostPayload } from '../../posts/types/dto';

describe('posts endpoints', () => {
  const request: supertest.SuperAgentTest = supertest.agent(app);

  const createPost = async (body: CreatePostPayload) =>
    request.post('/posts').send(body);

  describe('POST to /posts', () => {
    it('creates a post and returns its id', async () => {
      const createPostPayload: CreatePostPayload = {
        text: 'mockText',
        authorId: 'mockAuthorId',
        date: new Date('2023-07-19T23:15:30.000Z'),
      };

      const res = await createPost(createPostPayload);

      expect(res.status).to.equal(201);
      expect(res.body.id).to.be.a('string');
    });
  });

  describe('GET from /posts/:id', () => {
    it('returns a post', async () => {
      const createPostPayload: CreatePostPayload = {
        text: 'mockText',
        authorId: 'mockAuthorId',
        date: new Date('2023-07-19T23:15:30.000Z'),
      };

      const createPostResponse = await createPost(createPostPayload);

      const res = await request
        .get(`/posts/${createPostResponse.body.id}`)
        .send();

      expect(res.status).to.equal(200);
      expect(res.body._id).to.equal(createPostResponse.body.id);
    });

    it('returns an empty object if the post does not exist', async () => {
      const res = await request.get(`/posts/${shortid.generate()}`).send();

      expect(res.status).to.equal(200);
      expect(res.body).to.be.empty;
    });
  });

  describe('GET from /posts', () => {
    it('returns all the posts', async () => {
      const randomText = shortid.generate();

      const createPostPayload: CreatePostPayload = {
        text: randomText,
        authorId: 'mockAuthorId',
        date: new Date('2023-07-19T23:15:30.000Z'),
      };

      await createPost(createPostPayload);
      const res = await request.get(`/posts`).send();

      const found = res.body.some((post: Post) => post.text === randomText);

      expect(res.status).to.equal(200);
      expect(found).to.be.ok;
    });

    it('returns an empty array if there are no posts', async () => {
      await MongoDbService.dropCollection();
      await MongoDbService.createCollection('posts');

      const res = await request.get(`/posts`).send();

      expect(res.body.length).to.equal(0);
      expect(res.status).to.equal(200);
    });
  });

  describe('PATCH to /posts/:id', () => {
    it('patches a post and returns a 204 status code', async () => {
      const patchPostPayload: PatchPostPayload = {
        text: 'mockText',
      };

      const createPostPayload: CreatePostPayload = {
        text: 'mockText',
        authorId: 'mockAuthorId',
        date: new Date('2023-07-19T23:15:30.000Z'),
      };

      const createPostResponse = await createPost(createPostPayload);

      const res = await request
        .patch(`/posts/${createPostResponse.body.id}`)
        .send(patchPostPayload);

      expect(res.status).to.equal(204);
    });

    it('does not patch a non existing post and returns a 404 status code', async () => {
      const patchPostPayload: PatchPostPayload = {
        text: 'mockText',
      };

      const res = await request
        .patch(`/posts/${shortid.generate()}`)
        .send(patchPostPayload);

      expect(res.status).to.equal(404);
    });
  });

  describe('DELETE to /posts/:id', () => {
    it('deletes a post and returns a 204 status code', async () => {
      const createPostPayload: CreatePostPayload = {
        text: 'mockText',
        authorId: 'mockAuthorId',
        date: new Date('2023-07-19T23:15:30.000Z'),
      };

      const createPostResponse = await createPost(createPostPayload);

      const deleteUserResponse = await request
        .delete(`/posts/${createPostResponse.body.id}`)
        .send();

      const getUserResponse = await request
        .get(`/posts/${createPostResponse.body.id}`)
        .send();

      expect(getUserResponse.body).to.be.empty;
      expect(deleteUserResponse.status).to.equal(204);
    });
  });
});
