# 1Fi EMI Store

A full-stack web application that displays smartphones with multiple EMI plans backed by mutual funds. Product details, variants, pricing, images, and EMI plans are stored in MongoDB and served through a REST API — no hardcoded product data on the frontend.

Built for the 1Fi SDE1 assignment.

## Live Demo

**App:** https://1-fi-fullstack-assignment.vercel.app

**API:** https://onefi-fullstack-assignment.onrender.com/api/products

The frontend is deployed on Vercel and the API on Render, with the database on MongoDB Atlas.

> The API is hosted on Render's free tier, which sleeps after a period of inactivity. The first request may take 30–50 seconds while the service wakes up; subsequent requests are fast.

## Demo Video

_Video URL will be added here._

## Tech Stack

**Frontend**

- React 19
- Vite 8
- Tailwind CSS 4
- React Router 7
- Native `fetch` (no HTTP client library)

**Backend**

- Node.js (ES modules)
- Express 5
- Mongoose 9
- MongoDB Atlas

## Features

- Product listing page driven entirely by the API
- Dedicated product page per product at a unique URL (`/products/:slug`)
- Variant selection — switching a variant updates the image, MRP, price, discount, and EMI plans
- EMI plan selection showing monthly payment, tenure, interest rate, and cashback
- Proceed action that shows a confirmation summary of the selected variant and plan
- Inactive products are filtered out of the API and return 404 on the detail route
- Responsive layout from 320px to ultra-wide screens
- Loading, error (with retry), and empty states on both pages

## Project Structure

```
1fi-emi-store/
├── client/                       # React + Vite frontend
│   ├── public/images/            # Product variant images
│   ├── src/
│   │   ├── components/
│   │   │   └── ProductCard.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Product listing
│   │   │   └── ProductDetails.jsx
│   │   ├── utils/
│   │   │   └── formatCurrency.js
│   │   ├── App.jsx               # Routes
│   │   ├── config.js             # API base URL
│   │   ├── index.css             # Tailwind entry
│   │   └── main.jsx
│   ├── .env.example
│   └── vite.config.js
│
└── server/                       # Node.js + Express backend
    ├── src/
    │   ├── config/db.js          # MongoDB connection
    │   ├── controllers/productController.js
    │   ├── models/Product.js     # Mongoose schema
    │   ├── routes/productRoutes.js
    │   ├── app.js                # Express app + middleware
    │   ├── seed.js               # Seed script
    │   └── server.js             # Entry point
    └── .env.example
```

## Prerequisites

- Node.js 18 or higher
- npm
- A MongoDB connection string (MongoDB Atlas or a local MongoDB instance)

## Backend Setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` and set your MongoDB connection string:

```
PORT=5001
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/1fi-assignment
```

Seed the database:

```bash
npm run seed
```

Start the server:

```bash
npm run dev     # development, restarts on changes (nodemon)
npm start       # production
```

The API runs at `http://localhost:5001`.

> **Note on the port:** the backend uses port **5001** rather than 5000, because macOS AirPlay Receiver occupies port 5000 by default.

## Frontend Setup

```bash
cd client
npm install
```

The frontend defaults to `http://localhost:5001` for the API. To point it elsewhere, create a `.env` file:

```bash
cp .env.example .env
```

Start the dev server:

```bash
npm run dev     # http://localhost:5173
npm run build   # production build to dist/
npm run preview # preview the production build
npm run lint    # oxlint
```

Run the backend and frontend at the same time in separate terminals.

## Environment Variables

**Backend — `server/.env`**

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Port the API listens on. Defaults to `5001` if unset. |
| `MONGO_URI` | Yes | MongoDB connection string. The server exits with an error if this is missing. |

**Frontend — `client/.env`**

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | No | Base URL of the backend API. Defaults to `http://localhost:5001`. |

Vite only exposes variables prefixed with `VITE_` to client code. Both `.env` files are gitignored; `.env.example` files are committed as templates.

## API Endpoints

Base URL: `http://localhost:5001`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/products` | List all active products |
| GET | `/api/products/:slug` | Get a single active product by slug |
| POST | `/api/products` | Create a product |

All responses use a consistent envelope: `{ "success": boolean, ... }`.

### GET /api/health

```bash
curl http://localhost:5001/api/health
```

```json
{
  "success": true,
  "message": "1Fi EMI Store API is running"
}
```

### GET /api/products

Returns only products where `active: true`. Inactive products are filtered out at the database level.

```bash
curl http://localhost:5001/api/products
```

```json
{
  "success": true,
  "data": [
    {
      "_id": "6a983f9b732973577730f304",
      "name": "iPhone 17 Pro",
      "slug": "iphone-17-pro",
      "description": "Apple's flagship with the A19 Pro chip, a titanium frame and a 48MP Pro camera system.",
      "active": true,
      "variants": [
        {
          "_id": "6a98478c3bc8d0bdcfad4740",
          "name": "256GB Silver",
          "mrp": 134900,
          "price": 127400,
          "image": "/images/iphone-17-pro-silver.jpg",
          "emiPlans": [
            {
              "_id": "6a98478c3bc8d0bdcfad4741",
              "monthlyPayment": 42467,
              "tenure": 3,
              "interestRate": 0,
              "cashback": 7500
            }
          ]
        }
      ],
      "createdAt": "2026-09-02T15:24:10.880Z",
      "updatedAt": "2026-09-02T15:24:10.880Z"
    }
  ]
}
```

Truncated for brevity — the real response contains 3 products, each variant carrying 7 EMI plans.

### GET /api/products/:slug

```bash
curl http://localhost:5001/api/products/iphone-17-pro
```

Returns `200` with a single product object in `data` (same shape as above).

Returns `404` when the slug does not exist **or** the product is inactive:

```bash
curl http://localhost:5001/api/products/google-pixel-9-pro
```

```json
{
  "success": false,
  "message": "Product not found"
}
```

### POST /api/products

```bash
curl -X POST http://localhost:5001/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nothing Phone 3",
    "slug": "nothing-phone-3",
    "description": "Sample product.",
    "active": true,
    "variants": [
      {
        "name": "256GB White",
        "mrp": 42999,
        "price": 37999,
        "image": "/images/nothing-phone-3-white.jpg",
        "emiPlans": [
          { "monthlyPayment": 12666, "tenure": 3, "interestRate": 0, "cashback": 1500 }
        ]
      }
    ]
  }'
```

`201` on success, returning the created product with its generated `_id`.

`400` on a validation failure or a duplicate slug:

```json
{ "success": false, "message": "A product with this slug already exists" }
```

```json
{ "success": false, "message": "Product validation failed: name: Path `name` is required." }
```

`500` is returned for unexpected server or database errors.

## Database Schema

A single `products` collection. Variants and EMI plans are embedded subdocuments, not separate collections.

**Product**

| Field | Type | Constraints |
|---|---|---|
| `name` | String | required, trimmed |
| `slug` | String | required, unique, lowercase, trimmed |
| `description` | String | optional, trimmed |
| `variants` | [Variant] | required, must contain at least one entry |
| `active` | Boolean | defaults to `true` |
| `createdAt` / `updatedAt` | Date | added automatically by `timestamps: true` |

**Variant** (embedded in `Product.variants`)

| Field | Type | Constraints |
|---|---|---|
| `name` | String | required, trimmed |
| `mrp` | Number | required, min 0 |
| `price` | Number | required, min 0 |
| `image` | String | required, trimmed |
| `emiPlans` | [EmiPlan] | required, must contain at least one entry |

**EmiPlan** (embedded in `Variant.emiPlans`)

| Field | Type | Constraints |
|---|---|---|
| `monthlyPayment` | Number | required, min 0 |
| `tenure` | Number | required, min 1 (months) |
| `interestRate` | Number | required, min 0 (percent) |
| `cashback` | Number | required, min 0 |

Mongoose assigns an `_id` to every product, variant, and EMI plan, which the frontend uses as React keys and as the identity of the selected plan.

### Why the structure is embedded

Variants and EMI plans have no meaning outside their parent product — there is no use case for querying EMI plans on their own. Embedding them means the product page is served by a **single query with no joins**: `Product.findOne({ slug, active: true })` returns the product, all its variants, and every EMI plan in one round trip.

The trade-off is that this optimises for reads at the cost of write flexibility, which suits this data — it is read on every page view and written only when seeding.

Two validation details worth noting:

- `slug` carries a unique index, which guarantees one product per URL and is what makes duplicate creation fail with a `400`.
- `variants` and `emiPlans` use custom array validators. In Mongoose, `required: true` passes on an empty array, so `validate: (arr) => arr.length > 0` is what actually enforces that a product has variants and a variant has plans.

## Seed Data

```bash
cd server
npm run seed
```

The script inserts four products:

| Product | Slug | Variants | Active |
|---|---|---|---|
| iPhone 17 Pro | `iphone-17-pro` | 3 — 256GB Silver, 256GB Cosmic Orange, 512GB Deep Blue | Yes |
| Samsung Galaxy S24 Ultra | `samsung-galaxy-s24-ultra` | 2 — 256GB Titanium Black, 512GB Titanium Gray | Yes |
| OnePlus 13 | `oneplus-13` | 2 — 256GB Midnight Ocean, 512GB Arctic Dawn | Yes |
| Google Pixel 9 Pro | `google-pixel-9-pro` | 2 — 128GB Obsidian, 256GB Porcelain | **No** |

`google-pixel-9-pro` is seeded with `active: false` to demonstrate the active filter. It is excluded from `GET /api/products` and returns `404` from `GET /api/products/:slug`.

Every variant is given **7 EMI plans** — tenures of 3, 6, 12, and 24 months at 0% interest, and 36, 48, and 60 months at 10.5% interest. Monthly payments are calculated from the variant price using the standard amortisation formula rather than hardcoded, so they stay consistent with the price.

The script is **idempotent**. Each product is written with `findOneAndUpdate({ slug }, product, { upsert: true, runValidators: true })`, so running it repeatedly updates the existing documents by slug instead of creating duplicates.

## Frontend Routes

| Route | Page | Description |
|---|---|---|
| `/` | Home | Product listing, fetched from `GET /api/products` |
| `/products/:slug` | ProductDetails | Single product, fetched from `GET /api/products/:slug` |

Product images are served as static assets from `client/public/images/`, and the API stores the path to each image (for example `/images/iphone-17-pro-silver.jpg`).

## Deployment Notes

The backend and frontend deploy as two separate services.

**Backend** — set `MONGO_URI` in the hosting provider's environment variables. `PORT` is usually injected by the platform, and the server reads it via `process.env.PORT`.

**Frontend** — set `VITE_API_URL` to the deployed backend URL at build time. Vite inlines environment variables during the build, so this must be set before `npm run build`, not at runtime.

**SPA routing** — the app uses `BrowserRouter`, so deep links such as `/products/iphone-17-pro` must be rewritten to `index.html` by the host. Without a catch-all rewrite rule, loading or refreshing a product URL directly returns a 404 even though in-app navigation works. `client/vercel.json` provides this rule for Vercel:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

**CORS** — the API currently enables CORS for all origins. This can be restricted to the deployed frontend origin.
