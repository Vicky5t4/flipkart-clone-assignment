import { Router } from 'express';
import { query } from '../utils/db.js';

const router = Router();

// GET /api/categories
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await query('SELECT id, name, slug FROM categories ORDER BY name ASC');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

export default router;
