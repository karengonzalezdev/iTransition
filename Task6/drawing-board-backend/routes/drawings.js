const express = require('express');
const router = express.Router();
const { Drawing } = require('../models');

router.get('/board/:boardId', async (req, res) => {
  try {
    const drawings = await Drawing.findAll({ where: { boardId: req.params.boardId } });
    res.json(drawings);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const { boardId, data } = req.body;
    const drawing = await Drawing.create({ boardId, data });
    res.status(201).json(drawing);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;