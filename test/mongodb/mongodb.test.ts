import supertest from 'supertest';
import { expect } from 'chai';
import app, { stopServer } from 'index';

export const request: supertest.SuperAgentTest = supertest.agent(app);

after(async () => {
  await stopServer();
});

describe('mongodb endpoints', () => {
  describe('POST to /mongodb/drop', () => {
    it('drops the database', async () => {
      const dropDBResponse = await request.post('/mongodb/drop').send();

      expect(dropDBResponse.status).to.equal(204);
    });
  });

  describe('POST to /mongodb/seed', () => {
    it('seeds the database', async () => {
      const seedDBResponse = await request.post('/mongodb/seed').send();

      expect(seedDBResponse.status).to.equal(201);
    });
  });
});
