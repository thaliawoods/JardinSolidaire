// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'missing_token' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    // we store the user id on req.user.id
    req.user = { id: Number(payload.id_utilisateur || payload.id) };
    next();
  } catch (e) {
    return res.status(401).json({ error: 'invalid_token' });
  }
};
