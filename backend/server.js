const express = require('express');
const connection = require('./db'); 

const app = express();
app.use(express.json());

app.get('/api/jardins', (req, res) => {
  const query = 'SELECT * FROM jardins'; 
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erreur de récupération des jardins:', err);
      return res.status(500).send('Erreur serveur');
    }
    res.json(results);
  });
});

app.post('/api/jardins', (req, res) => {
  const { nom, description, photo_url } = req.body;
  const query = 'INSERT INTO jardins (nom, description, photo_url) VALUES (?, ?, ?)';
  connection.query(query, [nom, description, photo_url], (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'ajout d\'un jardin:', err);
      return res.status(500).send('Erreur serveur');
    }
    res.status(201).send('Jardin ajouté avec succès');
  });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
