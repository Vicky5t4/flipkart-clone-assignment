import { Router } from 'express';
import { query } from '../utils/db.js';

const router = Router();

// GET /api/products?search=&category=
router.get('/', async (req, res, next) => {
  try {
    const search = (req.query.search || '').trim();
    const category = (req.query.category || '').trim();

    const params = [];
    let where = 'WHERE 1=1';

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      where += ` AND LOWER(p.title) LIKE ?`;
    }

    if (category && category !== 'all') {
      params.push(category);
      where += ` AND c.slug = ?`;
    }

    const sql = `
      SELECT
        p.id,
        p.title,
        p.description,
        p.price,
        p.stock,
        c.name as category_name,
        c.slug as category_slug,
        (
          SELECT url
          FROM product_images
          WHERE product_id = p.id
          ORDER BY position ASC
          LIMIT 1
        ) AS thumbnail_url
      FROM products p
      JOIN categories c ON c.id = p.category_id
      ${where}
      ORDER BY p.id DESC
      LIMIT 200
    `;

    const { rows } = await query(sql, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid product id' });
    }

    const productRes = await query(
      `
      SELECT
        p.id,
        p.title,
        p.description,
        p.price,
        p.stock,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      JOIN categories c ON c.id = p.category_id
      WHERE p.id = ?
      `,
      [id]
    );

    if (productRes.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = productRes.rows[0];

    const imagesRes = await query(
      `SELECT url FROM product_images WHERE product_id = ? ORDER BY position ASC`,
      [id]
    );

    const specsRes = await query(
      `SELECT spec_key, spec_value FROM product_specs WHERE product_id = ? ORDER BY id ASC`,
      [id]
    );

    res.json({
      ...product,
      images: imagesRes.rows.map((r) => r.url),
      specs: specsRes.rows
    });
  } catch (err) {
    next(err);
  }
});

export default router;
