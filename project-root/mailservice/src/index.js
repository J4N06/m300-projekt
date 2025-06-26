// mailservice/src/index.js

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

app.post('/send', async (req, res) => {
  const { to, items } = req.body;

  const message = {
    from: 'buenzli-shop@beispiel.ch',
    to,
    subject: 'Merci für dini Bstellig! 🧀',
    html: `<h2>Grüezi</h2><p>Merci für dini Bestellung im Bünzli Shop.</p>
           <p><strong>Inhalt:</strong></p>
           <ul>${items.map(item => `<li>${item.name} – CHF ${item.price}</li>`).join('')}</ul>`
  };

  try {
    await transporter.sendMail(message);
    res.send('Mail verschickt');
  } catch (err) {
    console.error('Mailfehler:', err);
    res.status(500).send('Fehler beim Senden der Mail');
  }
});

app.listen(port, () => {
  console.log(`📬 Mailservice läuft auf Port ${port}`);
});
