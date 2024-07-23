const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'user@example.com' && password === 'password') {
    res.status(200).send({ auth: true, token: 'exampleToken' });
  } else {
    res.status(401).send({ auth: false });
  }
});

module.exports = app;