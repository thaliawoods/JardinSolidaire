// backend/lib/email.js
const { BREVO_API_KEY, MAIL_FROM, MAIL_FROM_NAME } = process.env;

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
      'api-key': BREVO_API_KEY,
      'accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  // Brevo renvoie souvent 201 + { messageId: ... }
  const bodyText = await res.text();
  if (!res.ok) {
    throw new Error(`Brevo API error ${res.status}: ${bodyText}`);
  }

  // optionnel: return JSON
  try { return JSON.parse(bodyText); } catch { return bodyText; }
}

module.exports = { sendMail };
