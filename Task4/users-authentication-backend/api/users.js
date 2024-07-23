const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const users = [
  { id: 1, name: 'user', email: 'user@example.com', status: 'active' }
];

app.get('/users', (req, res) => {
  const token = req.headers['x-access-token'];

  if (token) {
    res.status(200).send(users);
  } else {
    res.status(401).send({ error: 'Unauthorized' });
  }
});

app.patch('/users/:id/block', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);
  if (user) {
    user.status = 'blocked';
    res.status(200).send(user);
  } else {
    res.status(404).send({ error: 'User not found' });
  }
});

app.patch('/users/:id/unblock', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);
  if (user) {
    user.status = 'active';
    res.status(200).send(user);
  } else {
    res.status(404).send({ error: 'User not found' });
  }
});

app.delete('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === userId);
  if (index !== -1) {
    users.splice(index, 1);
    res.status(200).send({ success: true });
  } else {
    res.status(404).send({ error: 'User not found' });
  }
});

module.exports = app;