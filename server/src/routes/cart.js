import { Router } from 'express';
import { query } from '../utils/db.js';

const router = Router();

const DEFAULT_USER_ID = 1;

// GET /api/cart
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await query(
      `
      SELECT
        ci.id AS cart_item_id,
        ci.quantity,
        p.id AS product_id,
        p.title,
        p.price,
        p.stock,
        (
          SELECT url
          FROM product_images
          WHERE product_id = p.id
          ORDER BY position ASC
          LIMIT 1
        ) AS thumbnail_url
      FROM cart_items ci
      JOIN products p ON p.id = ci.product_id
      WHERE ci.user_id = ?
      ORDER BY ci.id DESC
      `,
      [DEFAULT_USER_ID]
    );

    const subtotal = rows.reduce(
      (sum, r) => sum + Number(r.price) * Number(r.quantity),
      0
    );

    res.json({
      items: rows,
      subtotal: Number(subtotal.toFixed(2))
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/cart  { productId, quantity }
router.post('/', async (req, res, next) => {
  try {
    const productId = Number(req.body.productId);
    const quantity = Number(req.body.quantity || 1);

    if (Number.isNaN(productId) || Number.isNaN(quantity) || quantity < 1) {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    const productRes = await query('SELECT id, stock FROM products WHERE id = ?', [productId]);

    if (productRes.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const stock = Number(productRes.rows[0].stock);
    if (stock <= 0) {
      return res.status(400).json({ message: 'Product is out of stock' });
    }

    // Upsert cart item for default user (MySQL)
    await query(
      `
      INSERT INTO cart_items (user_id, product_id, quantity)
      VALUES (?, ?, LEAST(?, ?))
      ON DUPLICATE KEY UPDATE
        quantity = LEAST(cart_items.quantity + ?, ?),
        updated_at = NOW()
      `,
      [DEFAULT_USER_ID, productId, quantity, stock, quantity, stock]
    );

    // Fetch the cart item id
    const idRes = await query(
      'SELECT id AS cart_item_id FROM cart_items WHERE user_id = ? AND product_id = ?',
      [DEFAULT_USER_ID, productId]
    );

    res.status(201).json({
      message: 'Added to cart',
      cart_item_id: idRes.rows[0]?.cart_item_id
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/cart/:cartItemId  { quantity }
router.patch('/:cartItemId', async (req, res, next) => {
  try {
    const cartItemId = Number(req.params.cartItemId);
    const quantity = Number(req.body.quantity);

    if (Number.isNaN(cartItemId) || Number.isNaN(quantity) || quantity < 1) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    // Find cart item
    const cartRes = await query(
      'SELECT product_id FROM cart_items WHERE id = ? AND user_id = ?',
      [cartItemId, DEFAULT_USER_ID]
    );

    if (cartRes.rows.length === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    const productId = cartRes.rows[0].product_id;
    const productRes = await query('SELECT stock FROM products WHERE id = ?', [productId]);

    const stock = Number(productRes.rows[0].stock || 0);
    const finalQty = Math.min(quantity, stock);

    await query(
      'UPDATE cart_items SET quantity = ?, updated_at = NOW() WHERE id = ? AND user_id = ?',
      [finalQty, cartItemId, DEFAULT_USER_ID]
    );

    res.json({ message: 'Quantity updated', quantity: finalQty });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/cart/:cartItemId
router.delete('/:cartItemId', async (req, res, next) => {
  try {
    const cartItemId = Number(req.params.cartItemId);
    if (Number.isNaN(cartItemId)) {
      return res.status(400).json({ message: 'Invalid cart item id' });
    }

    await query('DELETE FROM cart_items WHERE id = ? AND user_id = ?', [cartItemId, DEFAULT_USER_ID]);

    res.json({ message: 'Removed from cart' });
  } catch (err) {
    next(err);
  }
});

export default router;
