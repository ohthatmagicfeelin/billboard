// server/src/routes/apiRoutes.js
import express from 'express';
import pool from '../db/index.js';

const router = express.Router();

router.get('/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'An error occurred while fetching items' });
  }
});

router.post('/items', async (req, res) => {
  const { text } = req.body;
  try {
    const result = await pool.query('INSERT INTO items (text) VALUES ($1) RETURNING *', [text]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ error: 'An error occurred while adding the item' });
  }
});


export default router;

