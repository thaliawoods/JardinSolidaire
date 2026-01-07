const nodemailer = require('nodemailer');

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM } = process.env;

function getTransport() {
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error('SMTP is not configured');
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },

    // ✅ OBLIGATOIRE pour éviter les requêtes bloquées
    requireTLS: true,
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 8000,
  });
}

async function sendMail({ to, subject, text, html }) {
  const transport = getTransport();

  return transport.sendMail({
    from: MAIL_FROM || SMTP_USER,
    to,
    subject,
    text,
    html,
  });
}

module.exports = { sendMail };
