const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'user',
  password: 'password',
  database: 'jardinsolidaire',
});

client.connect()
  .then(() => {
    console.log('✅ Connexion réussie à la base de données');
    return client.end();
  })
  .catch(err => {
    console.error('❌ Erreur de connexion :', err);
  });

