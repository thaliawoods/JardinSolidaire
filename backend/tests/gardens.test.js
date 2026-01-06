const request = require('supertest');
const app = require('../server');

describe('GET /api/gardens', () => {
  it('returns 200 and an array of gardens with expected keys', async () => {
    const res = await request(app).get('/api/gardens');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    if (res.body.length > 0) {
      const g = res.body[0];

      expect(g).toEqual(expect.objectContaining({
        id: expect.any(String),
        title: expect.any(String),
        status: expect.any(String),
      }));

      expect(g).toHaveProperty('lat');
      expect(g).toHaveProperty('lng');
      expect(typeof g.lat).toBe('number');
      expect(typeof g.lng).toBe('number');

      expect(g).toHaveProperty('address');
      expect(typeof g.address).toBe('string');

      expect(g).toHaveProperty('photos');
      expect(Array.isArray(g.photos)).toBe(true);

      if (g.averageRating != null) expect(typeof g.averageRating).toBe('number');
      if (g.publishedAt != null)   expect(typeof g.publishedAt).toBe('string');
    }
  });
});

describe('GET /api/gardens/:id', () => {
  it('returns 404 for a non-existing garden', async () => {
    const res = await request(app).get('/api/gardens/99999999');
    expect([404, 400]).toContain(res.status);
  });
});
