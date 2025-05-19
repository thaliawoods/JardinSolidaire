const bcrypt = require('bcrypt');

describe('Hashage de mot de passe', () => {
  it('doit hasher un mot de passe et le vérifier correctement', async () => {
    const password = 'Test123!';
    const hashedPassword = await bcrypt.hash(password, 10);

    const isMatch = await bcrypt.compare(password, hashedPassword);
    expect(isMatch).toBe(true);
  });
});