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

module.exports = (req, res) => {
  if (req.method === 'POST') {
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
  } else {
    res.status(405).send({ message: 'Method Not Allowed' });
  }
};