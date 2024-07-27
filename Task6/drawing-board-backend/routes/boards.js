const express = require('express');
const router = express.Router();
const { Board } = require('../models');

router.get('/', async (req, res) => {
  try {
    const boards = await Board.findAll();
    res.json(boards);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;
    const board = await Board.create({ title, description });
    res.status(201).json(board);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const board = await Board.findByPk(req.params.id);
    if (board) {
      res.json(board);
    } else {
      res.status(404).send('Board not found');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;