import { getClient } from '../utils/db.js';

const categories = [
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Fashion', slug: 'fashion' },
  { name: 'Home & Furniture', slug: 'home-furniture' },
  { name: 'Books', slug: 'books' },
  { name: 'Grocery', slug: 'grocery' }
];

const products = [
  {
    title: 'Nova X1 Smartphone (6GB RAM, 128GB Storage)',
    description:
      'A fast and smooth smartphone with a 120Hz display, 50MP camera, and long-lasting battery.',
    price: 14999,
    stock: 25,
    categorySlug: 'electronics',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=900&q=80'
    ],
    specs: [
      { key: 'Display', value: '6.6 inch FHD+ 120Hz' },
      { key: 'Processor', value: 'Octa-Core 2.2GHz' },
      { key: 'Camera', value: '50MP + 8MP + 2MP' },
      { key: 'Battery', value: '5000mAh' }
    ]
  },
  {
    title: 'AeroBook 14 Laptop (i5, 16GB, 512GB SSD)',
    description:
      'Lightweight performance laptop with fast SSD, backlit keyboard, and all-day battery life.',
    price: 58990,
    stock: 12,
    categorySlug: 'electronics',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=80'
    ],
    specs: [
      { key: 'Processor', value: 'Intel Core i5 (12th Gen)' },
      { key: 'RAM', value: '16GB DDR4' },
      { key: 'Storage', value: '512GB NVMe SSD' },
      { key: 'Weight', value: '1.38 kg' }
    ]
  },
  {
    title: 'BassPro Wireless Earbuds (Noise Cancellation)',
    description:
      'Deep bass wireless earbuds with active noise cancellation and fast charging support.',
    price: 2499,
    stock: 40,
    categorySlug: 'electronics',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1585386959984-a41552231693?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1600267165629-58f02d1047e7?auto=format&fit=crop&w=900&q=80'
    ],
    specs: [
      { key: 'Playback', value: 'Up to 24 hours with case' },
      { key: 'Charging', value: 'USB Type-C, Fast Charge' },
      { key: 'Water Resistance', value: 'IPX4' },
      { key: 'ANC', value: 'Yes' }
    ]
  },
  {
    title: 'Men Solid Round Neck Cotton T-Shirt',
    description:
      'Comfortable cotton t-shirt for daily wear. Soft fabric with a clean, minimal design.',
    price: 399,
    stock: 80,
    categorySlug: 'fashion',
    images: [
      'https://images.unsplash.com/photo-1520975958221-5d5932a1e844?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1526481280695-3c687fd643ed?auto=format&fit=crop&w=900&q=80'
    ],
    specs: [
      { key: 'Fabric', value: '100% Cotton' },
      { key: 'Fit', value: 'Regular' },
      { key: 'Sleeve', value: 'Half Sleeve' },
      { key: 'Pattern', value: 'Solid' }
    ]
  },
  {
    title: 'Women Sneakers - Comfortable Casual Shoes',
    description:
      'Everyday sneakers with breathable mesh upper and soft cushioning for comfort.',
    price: 1299,
    stock: 35,
    categorySlug: 'fashion',
    images: [
      'https://images.unsplash.com/photo-1528701800489-20be3c93b7ef?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1528701800489-20be3c93b7ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80'
    ],
    specs: [
      { key: 'Material', value: 'Mesh + Rubber Sole' },
      { key: 'Usage', value: 'Casual / Walking' },
      { key: 'Closure', value: 'Lace Up' },
      { key: 'Warranty', value: '3 Months' }
    ]
  },
  {
    title: 'Ergo Office Chair (Adjustable, Lumbar Support)',
    description:
      'Ergonomic office chair with adjustable height and lumbar support for long work hours.',
    price: 6999,
    stock: 18,
    categorySlug: 'home-furniture',
    images: [
      'https://images.unsplash.com/photo-1582582421615-a2f31a4c31c0?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1616627980743-fbe1731c2b4c?auto=format&fit=crop&w=900&q=80'
    ],
    specs: [
      { key: 'Material', value: 'Fabric + Metal Base' },
      { key: 'Adjustable Height', value: 'Yes' },
      { key: 'Armrest', value: 'Fixed' },
      { key: 'Suitable For', value: 'Office / Home' }
    ]
  },
  {
    title: 'Non-Stick Cookware Set (5 Pieces)',
    description:
      'Durable non-stick cookware set for everyday cooking. Easy to clean and long-lasting.',
    price: 1699,
    stock: 50,
    categorySlug: 'home-furniture',
    images: [
      'https://images.unsplash.com/photo-1590846406792-0adc7f938f1c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1582582494700-3c5c6c00a5d9?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=900&q=80'
    ],
    specs: [
      { key: 'Pieces', value: '5' },
      { key: 'Coating', value: 'Non-stick' },
      { key: 'Compatible', value: 'Gas / Induction' },
      { key: 'Color', value: 'Black' }
    ]
  },
  {
    title: 'The Complete DSA Guide (Paperback)',
    description:
      'A beginner-friendly book to master Data Structures and Algorithms with examples and practice problems.',
    price: 499,
    stock: 60,
    categorySlug: 'books',
    images: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=80'
    ],
    specs: [
      { key: 'Language', value: 'English' },
      { key: 'Pages', value: '320' },
      { key: 'Publisher', value: 'TechPress' },
      { key: 'Format', value: 'Paperback' }
    ]
  },
  {
    title: 'Premium Basmati Rice (5kg)',
    description:
      'Long-grain basmati rice with rich aroma. Perfect for biryani and daily meals.',
    price: 699,
    stock: 45,
    categorySlug: 'grocery',
    images: [
      'https://images.unsplash.com/photo-1604908554039-8d4c877db1fd?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1598514982208-93562b7cfb09?auto=format&fit=crop&w=900&q=80'
    ],
    specs: [
      { key: 'Net Weight', value: '5 kg' },
      { key: 'Type', value: 'Basmati' },
      { key: 'Ideal For', value: 'Daily Cooking' },
      { key: 'Shelf Life', value: '12 Months' }
    ]
  }
];

async function seed() {
  const client = await getClient();

  try {
    await client.begin();

    // Clean tables
    await client.query('SET FOREIGN_KEY_CHECKS = 0');
    await client.query('TRUNCATE TABLE order_items');
    await client.query('TRUNCATE TABLE orders');
    await client.query('TRUNCATE TABLE cart_items');
    await client.query('TRUNCATE TABLE product_specs');
    await client.query('TRUNCATE TABLE product_images');
    await client.query('TRUNCATE TABLE products');
    await client.query('TRUNCATE TABLE categories');
    await client.query('TRUNCATE TABLE users');
    await client.query('SET FOREIGN_KEY_CHECKS = 1');

    // Default user (no login required)
    await client.query('INSERT INTO users (name, email) VALUES (?, ?)', [
      'Default User',
      'default@flipkartclone.local'
    ]);

    // Insert categories
    const categoryIdBySlug = {};
    for (const c of categories) {
      const res = await client.query('INSERT INTO categories (name, slug) VALUES (?, ?)', [
        c.name,
        c.slug
      ]);
      categoryIdBySlug[c.slug] = res.rows.insertId;
    }

    // Insert products with images & specs
    for (const p of products) {
      const categoryId = categoryIdBySlug[p.categorySlug];

      const prodRes = await client.query(
        'INSERT INTO products (title, description, price, stock, category_id) VALUES (?, ?, ?, ?, ?)',
        [p.title, p.description, p.price, p.stock, categoryId]
      );

      const productId = prodRes.rows.insertId;

      // Images
      for (let i = 0; i < p.images.length; i++) {
        await client.query(
          'INSERT INTO product_images (product_id, url, position) VALUES (?, ?, ?)',
          [productId, p.images[i], i + 1]
        );
      }

      // Specs
      for (const s of p.specs) {
        await client.query(
          'INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES (?, ?, ?)',
          [productId, s.key, s.value]
        );
      }
    }

    await client.commit();
    console.log('✅ Seed complete (MySQL)');
  } catch (e) {
    try {
      await client.rollback();
    } catch (_) {}
    console.error(e);
    process.exit(1);
  } finally {
    client.release();
  }
}

seed();
