const request = require('supertest');
const app = require('../server');

describe('Backend smoke tests', () => {
  it('GET / returns 200 and a ping text', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(typeof res.text).toBe('string');
    expect(res.text).toMatch(/Prisma backend is online/i);
  });

  it('Unknown route returns 404 JSON', async () => {
    const res = await request(app).get('/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'NOT_FOUND');
  });
});
