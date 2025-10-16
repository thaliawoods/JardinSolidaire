// backend/tests/hashPassword.test.js
const bcrypt = require('bcrypt');
const { hashPassword } = require('../utils');

describe('Password hashing', () => {
  it('hashes a password and verifies it with bcrypt', async () => {
    const password = 'Test123!';
    const hashed = await hashPassword(password);

    expect(hashed).toBeDefined();
    expect(typeof hashed).toBe('string');
    expect(hashed).not.toBe(password);

    // bcrypt should validate the original password
    const ok = await bcrypt.compare(password, hashed);
    expect(ok).toBe(true);

    // and reject a wrong password
    const bad = await bcrypt.compare('wrong', hashed);
    expect(bad).toBe(false);
  });
});
