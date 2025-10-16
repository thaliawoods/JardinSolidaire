const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const BEARER = 'bearer ';

  if (!authHeader || !authHeader.toLowerCase().startsWith(BEARER)) {
    return res.status(401).json({ error: 'missing_authorization_header' });
  }

  const token = authHeader.slice(BEARER.length).trim();
  if (!token) {
    return res.status(401).json({ error: 'missing_token' });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ error: 'server_misconfigured', detail: 'JWT_SECRET is not set' });
  }

  try {
    const payload = jwt.verify(token, secret);

    const rawId = payload.userId ?? payload.id ?? payload.id_utilisateur;

    const id = Number(rawId);
    if (!Number.isFinite(id) || id <= 0) {
      return res.status(401).json({ error: 'invalid_token_payload' });
    }

    req.user = { id };
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'invalid_token' });
  }
};
