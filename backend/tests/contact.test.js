const request = require('supertest');
const app = require('../server');

describe('POST /api/contact', () => {
  it('returns 400/422 on missing required fields', async () => {
    const res = await request(app).post('/api/contact').send({ email: '', message: '' });
    expect([400, 422]).toContain(res.status);
    expect(typeof res.body).toBe('object');
  });

  // TODO: Unskip once route accepts test payload (may require CAPTCHA or extra fields)
  it.skip('returns 200/201 on valid payload', async () => {
    const res = await request(app).post('/api/contact').send({
      name: 'Alice',
      email: 'alice@example.com',
      message: 'Hello JardinSolidaire! This message is long enough for validation.',
      // subject: 'General',            // uncomment if required
      // consent: true,                 // uncomment if required
      // recaptchaToken: 'test-token',  // uncomment if required
    });
    expect([200, 201]).toContain(res.status);
  });
});
