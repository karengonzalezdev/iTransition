const express = require('express');
const cors = require('cors');
const app = express();
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

app.use(express.json());

const corsOptions = {
  origin: 'https://users-authentication-psi.vercel.app',
  optionsSuccessStatus: 200,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "x-access-token, X-Access-Token, Content-Type"
};

app.use(cors(corsOptions));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'itransition123.',
  database: 'users_authentication'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error on the server.' });
    if (results.length === 0) return res.status(404).json({ message: 'No user found.' });
    const user = results[0];
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) return res.status(401).json({ auth: false, token: null });
    const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: 86400 });
    res.status(200).json({ auth: true, token: token });
  });
});

module.exports = app;