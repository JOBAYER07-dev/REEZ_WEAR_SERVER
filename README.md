# ⚙️ REEZ Wear - Backend API

The robust backend engine powering the REEZ Wear e-commerce ecosystem, built with scalability, security, and TypeScript.

---

## 🌐 Deployment

**Backend API:** [https://reez-wear-server.onrender.com](https://reez-wear-server.onrender.com)

---

## 🔑 Core Features

- **Secure Authentication:** Powered by Better Auth with MongoDB adapter.
- **Role-Based Access Control (RBAC):** Middleware-based protection to ensure only admins can manage store items and users.
- **Product Management:** Full CRUD operations for the product catalog.
- **Order Processing:** End-to-end order management system.
- **Admin Utilities:** Endpoints for user role updates and administrative oversight.
- **Analytics Ready:** Optimized database queries for product listing and filtering.

---

## 🛠 Tech Stack

- **Runtime:** Node.js & Express.js
- **Language:** TypeScript
- **Database:** MongoDB
- **Authentication:** Better Auth (with Admin Plugin)
- **Deployment:** Render

---

## 📦 Local Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/JOBAYER07-dev/REEZ_WEAR_SERVER
   cd REEZ_WEAR_SERVER
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Setup Environment Variables (`.env`):**

   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   BETTER_AUTH_SECRET=your_secret_key
   BETTER_AUTH_URL=https://reez-wear-server.onrender.com
   CLIENT_URL=https://reez-wear.vercel.app
   GOOGLE_CLIENT_ID=your_google_id
   GOOGLE_CLIENT_SECRET=your_google_secret
   ```

4. **Run server:**

   ```bash
   npm run dev
   ```

---

## 🌐 API Endpoints

| Method | Endpoint                | Description                       |
|--------|--------------------------|------------------------------------|
| POST   | `/api/auth/*`            | Authentication routes             |
| GET    | `/api/products`          | Get product listing with filters  |
| POST   | `/api/products`          | Create product (Admin only)       |
| PUT    | `/api/products/:id`      | Update product (Admin only)       |
| DELETE | `/api/products/:id`      | Delete product (Admin only)       |
| POST   | `/api/orders`            | Place new order                   |
| GET    | `/api/orders`            | View all orders (Admin only)      |
| PUT    | `/api/users/:id/role`    | Update user roles (Admin only)    |

---

© 2026 REEZ Wear Backend. All rights reserved.