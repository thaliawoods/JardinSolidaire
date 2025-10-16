const bcrypt = require('bcrypt');

const ROUNDS = Number(process.env.BCRYPT_ROUNDS || 10);

async function hashPassword(password) {
  if (typeof password !== 'string' || !password.length) {
    throw new Error('password_required');
  }
  const rounds = Number.isFinite(ROUNDS) && ROUNDS > 0 ? ROUNDS : 10;
  return bcrypt.hash(password, rounds);
}

async function verifyPassword(password, hash) {
  if (typeof hash !== 'string') return false;
  if (!hash.startsWith('$2')) {
    return password === hash;
  }
  return bcrypt.compare(password, hash);
}

module.exports = { hashPassword, verifyPassword };
