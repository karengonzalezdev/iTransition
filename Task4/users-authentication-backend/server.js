const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(express.json());

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
  };
  
  app.use(cors(corsOptions));

const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });
    jwt.verify(token, 'secret', (err, decoded) => {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        req.userId = decoded.id;
        next();
    });
};

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error on the server.' });
        res.status(200).json({ success: true, message: 'User registered successfully.' });
    });
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

app.get('/users', verifyToken, (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) return res.status(500).json({ message: 'Error on the server.' });
        res.status(200).json(results);
    });
});

app.patch('/users/:id/block', verifyToken, (req, res) => {
    const { id } = req.params;
    db.query('UPDATE users SET status = "blocked" WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error on the server.' });
        res.status(200).json({ message: 'User blocked successfully.' });
    });
});

app.patch('/users/:id/unblock', verifyToken, (req, res) => {
    const { id } = req.params;
    db.query('UPDATE users SET status = "active" WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error on the server.' });
        res.status(200).json({ message: 'User unblocked successfully.' });
    });
});

app.delete('/users/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error on the server.' });
        res.status(200).json({ message: 'User deleted successfully.' });
    });
});

app.get('/', (req, res) => {
    res.send('Hello World! Your server is running.');
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});