const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });
  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    req.userId = decoded.id;
    next();
  });
};

module.exports = (req, res) => {
  if (req.method === 'GET') {
    verifyToken(req, res, () => {
      db.query('SELECT * FROM users', (err, results) => {
        if (err) return res.status(500).json({ message: 'Error on the server.' });
        res.status(200).json(results);
      });
    });
  } else {
    res.status(405).send({ message: 'Method Not Allowed' });
  }
};
