const crypto = require('crypto');

function randomToken() {
  return crypto.randomBytes(32).toString('hex');
}
function hashToken(token) {
  return crypto.createHash('sha256').update(String(token)).digest('hex');
}
function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

module.exports = { randomToken, hashToken, addMinutes };
