const express = require('express');
const app = express();
const port = 5001;

// Temporarily commenting out the DB connection
/*
const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database');
});
*/

// Your other server routes and logic
app.get('/', (req, res) => {
  res.send('Hello, JardinSolidaire Backend!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
