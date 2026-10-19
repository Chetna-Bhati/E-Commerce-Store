# threadline.

Everyday clothes. Fair prices.

A full-stack portfolio e-commerce platform built for the Indian market. Threadline focuses on honest pricing, clean typography, responsive mobile-first UX, and production-grade database transactions.

---

## Tech Stack

- **Frontend**: React (Vite), JavaScript, Tailwind CSS, React Router, Axios, React Hook Form, Recharts, Lucide React
- **Backend**: Node.js, Express, MySQL 8 (via `mysql2/promise` with parameterized raw SQL), Zod, Helmet, CORS, Express Rate Limit
- **Auth**: JWT + bcrypt
- **Payments**: Razorpay in Test Mode + Cash on Delivery (COD)
- **Uploads**: Multer local storage
- **Documentation & Testing**: Swagger UI (`/api/docs`), Jest + Supertest

---

## Design System

- **Palette**:
  - Background: `#F5F4F2` (Off-white)
  - Dark/Primary: `#111111` (Black)
  - Accent: `#F97316` (Warm Orange)
  - Border: `#E2E2E0`
  - Muted: `#6B6B6B`
  - Placeholder: `#EBEBE9`
  - Buttons: Black text on orange background (`bg-[#F97316] text-[#111111]`)
- **Typography**: Archivo (Headings, 800 weight) & DM Sans (Body)
- **Geometry**: 4px radius, 1px solid borders, left-aligned editorial layout

---

## Product Catalog & Photography Mapping

The store is seeded with 40 distinct fashion items across 8 categories, each with 3–4 4:5 portrait photos stored in `/client/public/images/products/`:

| Category | Products | Image Prefix | Source / Licence |
|---|---|---|---|
| **T-shirts** | Boxy Tee, Pocket Tee, Graphic Tee, Breton Striped, Pique Polo, Raw Hem Oversized | `heavyweight-boxy-tee-*.webp`, `relaxed-pocket-tee-*.webp`, etc. | Free Unsplash / Pexels licence |
| **Shirts** | Linen-Blend, Oxford Button-Down, Flannel Check, Denim Shirt, Camp Collar | `french-linen-blend-shirt-*.webp`, `classic-oxford-button-down-*.webp`, etc. | Free Unsplash / Pexels licence |
| **Jeans** | Raw Indigo Slim, Straight-Fit Blue, Carpenter Jeans, Jet Black, Light-Wash Baggy | `slim-fit-raw-indigo-jeans-*.webp`, `straight-fit-classic-blue-*.webp`, etc. | Free Unsplash / Pexels licence |
| **Trousers** | Stretch Chinos, Cargo Pants, Pleated Formal, Loopback Joggers, Linen Easy Pants | `tailored-stretch-chinos-*.webp`, `multi-pocket-cargo-pants-*.webp`, etc. | Free Unsplash / Pexels licence |
| **Jackets and hoodies** | Denim Trucker, Flight Bomber, Heavyweight Hoodie, Track Windcheater, Zip Hoodie | `trucker-denim-jacket-*.webp`, `ma-1-flight-bomber-jacket-*.webp`, etc. | Free Unsplash / Pexels licence |
| **Dresses and kurtas** | Tiered Midi Dress, Belted Shirt Dress, Handblock Kurta, Short Kurta, A-Line Dress | `tiered-cotton-midi-dress-*.webp`, `handblock-print-cotton-kurta-*.webp`, etc. | Free Unsplash / Pexels licence |
| **Shoes** | Low-Top Canvas, Knit Runners, Suede Penny Loafers, Moulded Slides | `low-top-canvas-sneakers-*.webp`, `suede-penny-loafers-*.webp`, etc. | Free Unsplash / Pexels licence |
| **Accessories** | 6-Panel Cap, Waxed Daypack, Bauhaus Watch, Leather Belt, Polarized Sunglasses | `6-panel-twill-baseball-cap-*.webp`, `minimalist-canvas-backpack-*.webp`, etc. | Free Unsplash / Pexels licence |

---

## Seed Accounts

- **Admin Account**:
  - Email: `admin@threadline.com`
  - Password: `password123`
- **Customer Test Account**:
  - Email: `user@threadline.com`
  - Password: `password123`

---

## Coupons

- `FIRST100` — Flat ₹100 off on minimum order of ₹500
- `THREAD15` — 15% off up to ₹300 on orders above ₹1,200
- `FESTIVE20` — 20% off up to ₹500 on orders above ₹2,000

---

## Razorpay Test Mode Guide

Use these credentials when completing test transactions:
- **Card Flow**: Number `4111 1111 1111 1111`, any future expiry date (e.g. `12/28`), any 3-digit CVV (e.g. `123`), OTP: `123456`
- **UPI Flow**: `success@razorpay`

---

## Getting Started

### 1. Database Setup
Ensure MySQL 8 is running locally or via Docker:
```bash
docker compose up -d mysql
```
Or import manually:
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p threadline_db < database/seed.sql
```

### 2. Backend Server
```bash
cd server
npm install
npm run dev
```
Server runs at `http://localhost:5000`. Swagger API docs at `http://localhost:5000/api/docs`.

### 3. Frontend Client
```bash
cd client
npm install
npm run dev
```
Client runs at `http://localhost:5173`.
