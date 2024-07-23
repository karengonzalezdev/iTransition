const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (name && email && password) {
    res.status(200).send({ success: true, message: 'User registered successfully.' });
  } else {
    res.status(400).send({ success: false });
  }
});

module.exports = app;