const mysql = require('mysql2');
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

module.exports = (req, res) => {
  if (req.method === 'POST') {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ message: 'Error on the server.' });
      res.status(200).json({ success: true, message: 'User registered successfully.' });
    });
  } else {
    res.status(405).send({ message: 'Method Not Allowed' });
  }
};