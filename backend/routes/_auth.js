// routes/_auth.js
const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  try {
    const h = req.headers.authorization || '';
    const token = h.startsWith('Bearer ') ? h.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'unauthorized' });
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    const id = Number(payload.userId || payload.id || payload.sub);
    if (!id) return res.status(401).json({ error: 'unauthorized' });
    req.user = { id };
    next();
  } catch {
    return res.status(401).json({ error: 'unauthorized' });
  }
}

module.exports = { requireAuth };
