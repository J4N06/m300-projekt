// backend/src/index.js

const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.use(cors());
app.use(bodyParser.json());

// Auth Middleware
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('Token fehlt');

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send('Token ungültig');
    req.user = decoded;
    next();
  });
}

// Routen
app.get('/', (req, res) => {
  res.send('Bünzli Shop API läuft 🎉');
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
  if (result.rows.length === 0) return res.status(401).send('Login fehlgeschlagen');

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
});

app.get('/produkte', async (req, res) => {
  const result = await pool.query('SELECT * FROM products');
  res.json(result.rows);
});

app.post('/bestellung', verifyToken, async (req, res) => {
  const { email, items } = req.body;
  await pool.query('INSERT INTO orders (email, items) VALUES ($1, $2)', [email, JSON.stringify(items)]);

  // Aufruf des Mail-Service (vereinfachte Variante)
  fetch(`${process.env.MAIL_SERVICE_URL}/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to: email, items })
  });

  res.send('Bestellung erhalten. Merci viu mau! 🧀');
});

app.listen(port, () => {
  console.log(`Backend läuft auf Port ${port}`);
});
