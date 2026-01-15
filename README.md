# Flipkart Clone - E-Commerce Platform (SDE Intern Fullstack Assignment)

This is a **Flipkart-like e-commerce web app** with:
- Product listing (grid, Flipkart-style cards)
- Search + category filter
- Product detail page with image carousel
- Cart management (add / update qty / remove)
- Checkout + Order placement + Order confirmation with Order ID

✅ **No login required** (assumes a default user is logged in)

---

## Tech Stack (Only what the assignment asked)
- **Frontend:** React.js (SPA using Vite)
- **Backend:** Node.js + Express.js (REST API)
- **Database:** MySQL

---

## Folder Structure

```
flipkart-clone-assignment/
  client/   # React SPA
  server/   # Express API
  docker-compose.yml (optional MySQL)
  package.json (run both client+server)
```

---

## 1) Setup (Local) - Run in VS Code

### Prerequisites
- Node.js 18+
- MySQL 8+ (recommended)

> Optional: You can also run MySQL with Docker, but it is NOT required.

### Step A: Create a MySQL database

Create a database named `flipkart_clone`.

Example (MySQL CLI):

```sql
CREATE DATABASE flipkart_clone;
```

### Step B: Install dependencies
From project root:

```bash
npm install
npm run install:all
```

### Step C: Configure environment

#### Backend env
Copy and edit:

```bash
cd server
cp .env.example .env
```

#### Frontend env
Copy and edit:

```bash
cd ../client
cp .env.example .env
```

---

## 2) Create Tables + Seed Sample Data
From project root:

```bash
npm run db:init
npm run seed
```

---

## 3) Run the App (Client + Server)
From project root:

```bash
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:8080

---

## API Endpoints

### Products
- `GET /api/products?search=&category=`
- `GET /api/products/:id`

### Categories
- `GET /api/categories`

### Cart (default user)
- `GET /api/cart`
- `POST /api/cart` `{ productId, quantity }`
- `PATCH /api/cart/:cartItemId` `{ quantity }`
- `DELETE /api/cart/:cartItemId`

### Orders
- `POST /api/orders` (place order)
- `GET /api/orders/:id` (order confirmation)
- `GET /api/orders` (bonus: order history)

---

## Database Schema (High level)

- `users`
- `categories`
- `products`
- `product_images`
- `product_specs`
- `cart_items` (unique by user_id + product_id)
- `orders`
- `order_items`

---

## Deployment (Easy)

### Backend (Render/Railway)
1. Deploy `server/`
2. Add env:
   - `DATABASE_URL=...`
   - or set `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`
   - `CLIENT_ORIGIN=<your frontend url>`

### Frontend (Vercel/Netlify)
1. Deploy `client/`
2. Set env:
   - `VITE_API_URL=<your backend url>`

---

## Notes / Assumptions
- A default user (`id=1`) is pre-seeded, so no auth flow is required.
- Product images are public URLs.
- Shipping fee logic: free above ₹999, else ₹50.

---

## Screens & Features Checklist
- ✅ Product Listing (Flipkart-like grid)
- ✅ Search by product name
- ✅ Filter by category
- ✅ Product detail page with carousel
- ✅ Add to cart, buy now
- ✅ Cart update qty + remove
- ✅ Checkout shipping form
- ✅ Place order + show Order ID

