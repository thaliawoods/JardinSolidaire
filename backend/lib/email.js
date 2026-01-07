// backend/lib/email.js — Brevo API (HTTP) ✅
const { BREVO_API_KEY, MAIL_FROM, MAIL_FROM_NAME } = process.env;

// Si ton Node est < 18, décommente les 2 lignes suivantes :
// const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

async function sendMail({ to, subject, text, html }) {
  if (!BREVO_API_KEY) throw new Error('BREVO_API_KEY is not configured');
  if (!MAIL_FROM) throw new Error('MAIL_FROM is not configured');

  const payload = {
    sender: {
      name: MAIL_FROM_NAME || 'JardinSolidaire',
      email: MAIL_FROM,
    },
    to: [{ email: to }],
    subject,
    textContent: text,
    htmlContent: html,
  };

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
      'api-key': BREVO_API_KEY,
    },
    body: JSON.stringify(payload),
  });

  const bodyText = await res.text();
  if (!res.ok) {
    throw new Error(`Brevo API error ${res.status}: ${bodyText}`);
  }

  try {
    return JSON.parse(bodyText);
  } catch {
    return bodyText;
  }
}

module.exports = { sendMail };
