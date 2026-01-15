import { Router } from 'express';
import { getClient, query } from '../utils/db.js';

const router = Router();

const DEFAULT_USER_ID = 1;

function computeShippingFee(subtotal) {
  // Keep it simple. Flipkart-like small delivery fee.
  // Free shipping above 999.
  return subtotal >= 999 ? 0 : 50;
}

// GET /api/orders  (bonus order history)
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await query(
      `
      SELECT id, status, subtotal, shipping_fee, total, created_at
      FROM orders
      WHERE user_id = ?
      ORDER BY id DESC
      LIMIT 50
      `,
      [DEFAULT_USER_ID]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/:id
router.get('/:id', async (req, res, next) => {
  try {
    const orderId = Number(req.params.id);
    if (Number.isNaN(orderId)) {
      return res.status(400).json({ message: 'Invalid order id' });
    }

    const orderRes = await query(
      `
      SELECT *
      FROM orders
      WHERE id = ? AND user_id = ?
      `,
      [orderId, DEFAULT_USER_ID]
    );

    if (orderRes.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const itemsRes = await query(
      `
      SELECT
        oi.product_id,
        oi.title_snapshot,
        oi.price_snapshot,
        oi.quantity
      FROM order_items oi
      WHERE oi.order_id = ?
      ORDER BY oi.id ASC
      `,
      [orderId]
    );

    res.json({
      order: orderRes.rows[0],
      items: itemsRes.rows
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/orders  (place order)
router.post('/', async (req, res, next) => {
  const {
    fullName,
    phone,
    addressLine1,
    addressLine2,
    city,
    state,
    pincode
  } = req.body || {};

  if (!fullName || !phone || !addressLine1 || !city || !state || !pincode) {
    return res.status(400).json({ message: 'Shipping address is incomplete' });
  }

  const client = await getClient();

  try {
    await client.begin();

    // Load cart items
    const cartRes = await client.query(
      `
      SELECT
        ci.id AS cart_item_id,
        ci.quantity,
        p.id AS product_id,
        p.title,
        p.price,
        p.stock
      FROM cart_items ci
      JOIN products p ON p.id = ci.product_id
      WHERE ci.user_id = ?
      ORDER BY ci.id ASC
      `,
      [DEFAULT_USER_ID]
    );

    if (cartRes.rows.length === 0) {
      await client.rollback();
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Validate stock
    for (const row of cartRes.rows) {
      if (Number(row.stock) < Number(row.quantity)) {
        await client.rollback();
        return res.status(400).json({
          message: `Not enough stock for: ${row.title}`
        });
      }
    }

    const subtotal = cartRes.rows.reduce(
      (sum, r) => sum + Number(r.price) * Number(r.quantity),
      0
    );

    const shippingFee = computeShippingFee(subtotal);
    const total = subtotal + shippingFee;

    // Create order
    const orderInsert = await client.query(
      `
      INSERT INTO orders (
        user_id, subtotal, shipping_fee, total,
        ship_full_name, ship_phone, ship_address_line1, ship_address_line2,
        ship_city, ship_state, ship_pincode
      ) VALUES (
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?
      )
      `,
      [
        DEFAULT_USER_ID,
        subtotal,
        shippingFee,
        total,
        fullName,
        phone,
        addressLine1,
        addressLine2 || null,
        city,
        state,
        pincode
      ]
    );

    const orderId = orderInsert.rows.insertId;

    // Create order items
    for (const row of cartRes.rows) {
      await client.query(
        `
        INSERT INTO order_items (
          order_id, product_id, title_snapshot, price_snapshot, quantity
        ) VALUES (?, ?, ?, ?, ?)
        `,
        [
          orderId,
          row.product_id,
          row.title,
          row.price,
          row.quantity
        ]
      );

      // Deduct stock
      await client.query(
        `
        UPDATE products
        SET stock = stock - ?
        WHERE id = ?
        `,
        [row.quantity, row.product_id]
      );
    }

    // Clear cart
    await client.query('DELETE FROM cart_items WHERE user_id = ?', [
      DEFAULT_USER_ID
    ]);

    await client.commit();

    res.status(201).json({ message: 'Order placed', orderId });
  } catch (err) {
    try {
      await client.rollback();
    } catch (_) {}
    next(err);
  } finally {
    client.release();
  }
});

export default router;
