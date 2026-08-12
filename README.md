# 🚀 Prisma Express Server API

A robust RESTful API built with **Node.js**, **Express**, **Prisma ORM**, and **PostgreSQL**.

---

## 🛠️ Tech Stack & Prerequisites

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Authentication:** JSON Web Tokens (JWT) & Bcrypt

---

## ⚙️ Setup & Environment Configuration

1. **Clone & Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
   JWT_SECRET="your_jwt_secret_key"
   ```

3. **Prisma Database Setup:**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```

---

## 🌐 API Overview

- **Base URL:** `http://localhost:5000` *(or configured PORT)*
- **Content-Type:** `application/json`

---

## 🔐 Authentication Header

For all protected routes, pass the token in the `Authorization` request header:

```http
Authorization: Bearer <your_jwt_token>
```

---

## 📦 Standard Response Structure

### Success Response
```json
{
  "success": true,
  "message": "Operation description",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "data": {}
}
```

---

## 🚦 System / Health Check

### 1. Health Check
* **Method:** `GET`
* **Endpoint:** `/`
* **Auth:** Public
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Welcome to server",
    "data": {}
  }
  ```

---

## 🗝️ Auth Endpoints (`/api/auth`)

### 1. Register User
* **Method:** `POST`
* **Endpoint:** `/api/auth/register`
* **Auth:** Public
* **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "USER",
    "avatar": "https://example.com/avatar.jpg"
  }
  ```
  *(Note: `role` must be `"ADMIN"` or `"USER"`. `avatar` is optional)*

* **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "token": "eyJhbGciOi...",
      "user": {
        "id": "uuid-string",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "USER",
        "avatar": "https://example.com/avatar.jpg"
      }
    }
  }
  ```

### 2. User Login
* **Method:** `POST`
* **Endpoint:** `/api/auth/login`
* **Auth:** Public
* **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "eyJhbGciOi...",
      "user": {
        "id": "uuid-string",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "USER",
        "avatar": "https://example.com/avatar.jpg"
      }
    }
  }
  ```

### 3. Get Current Profile
* **Method:** `GET`
* **Endpoint:** `/api/auth/me`
* **Auth:** Protected (Bearer Token)
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "User profile fetched successfully",
    "data": {
      "id": "uuid-string",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "avatar": "https://example.com/avatar.jpg"
    }
  }
  ```

---

## 👤 User Endpoints (`/api/users`)

### 1. Create User
* **Method:** `POST`
* **Endpoint:** `/api/users`
* **Auth:** Protected (Bearer Token)
* **Request Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "password123",
    "role": "USER",
    "avatar": null
  }
  ```

### 2. Get All Users
* **Method:** `GET`
* **Endpoint:** `/api/users`
* **Auth:** Optional Auth
* **Response (200 OK):** List of all active non-deleted users.

### 3. Get User By ID
* **Method:** `GET`
* **Endpoint:** `/api/users/:id`
* **Auth:** Optional Auth
* **Response (200 OK):** User details along with associated `orders` and `reviews`.

### 4. Update User
* **Method:** `PUT`
* **Endpoint:** `/api/users/:id`
* **Auth:** Protected (Bearer Token)
* **Request Body:** `{ "name": "New Name", "email": "new@example.com", "role": "ADMIN", "avatar": "new_url" }`

### 5. Delete User (Soft Delete)
* **Method:** `DELETE`
* **Endpoint:** `/api/users/:id`
* **Auth:** Protected (Bearer Token)

---

## 🏷️ Category Endpoints (`/api/categories`)

### 1. Create Category
* **Method:** `POST`
* **Endpoint:** `/api/categories`
* **Auth:** Protected (Bearer Token)
* **Request Body:**
  ```json
  {
    "name": "Electronics",
    "description": "Gadgets and devices"
  }
  ```

### 2. Get All Categories
* **Method:** `GET`
* **Endpoint:** `/api/categories`
* **Auth:** Public

### 3. Get Category By ID
* **Method:** `GET`
* **Endpoint:** `/api/categories/:id`
* **Auth:** Public
* **Response (200 OK):** Category details including associated active products.

### 4. Update Category
* **Method:** `PATCH`
* **Endpoint:** `/api/categories/:id`
* **Auth:** Protected (Bearer Token)
* **Request Body:** `{ "name": "Updated Name", "description": "Updated Description" }`

### 5. Delete Category (Soft Delete)
* **Method:** `DELETE`
* **Endpoint:** `/api/categories/:id`
* **Auth:** Protected (Bearer Token)

---

## 🛍️ Product Endpoints (`/api/products`)

### 1. Create Product
* **Method:** `POST`
* **Endpoint:** `/api/products`
* **Auth:** Protected (Bearer Token)
* **Request Body:**
  ```json
  {
    "title": "Wireless Headphones",
    "description": "High quality noise-cancelling headphones",
    "price": 199,
    "stock": 50,
    "categoryId": "category-uuid-optional"
  }
  ```

### 2. Get All Products
* **Method:** `GET`
* **Endpoint:** `/api/products`
* **Auth:** Public
* **Response (200 OK):** Returns all products with category details.

### 3. Get Product By ID
* **Method:** `GET`
* **Endpoint:** `/api/products/:id`
* **Auth:** Public
* **Response (200 OK):** Returns product details with category and non-deleted reviews.

### 4. Update Product
* **Method:** `PATCH`
* **Endpoint:** `/api/products/:id`
* **Auth:** Protected (Bearer Token)
* **Request Body:** `{ "title": "Updated Title", "price": 179, "stock": 40 }`

### 5. Delete Product (Soft Delete)
* **Method:** `DELETE`
* **Endpoint:** `/api/products/:id`
* **Auth:** Protected (Bearer Token)

---

## ⭐ Review Endpoints (`/api/reviews`)

### 1. Create Review
* **Method:** `POST`
* **Endpoint:** `/api/reviews`
* **Auth:** Optional Auth *(If token is provided, `userId` is obtained automatically; otherwise supply `userId` in body)*
* **Request Body:**
  ```json
  {
    "rating": 5,
    "comment": "Excellent product!",
    "productId": "product-uuid",
    "userId": "user-uuid-if-unauthenticated"
  }
  ```

### 2. Get All Reviews
* **Method:** `GET`
* **Endpoint:** `/api/reviews`
* **Auth:** Public

### 3. Get Review By ID
* **Method:** `GET`
* **Endpoint:** `/api/reviews/:id`
* **Auth:** Public

### 4. Update Review
* **Method:** `PATCH`
* **Endpoint:** `/api/reviews/:id`
* **Auth:** Protected (Bearer Token)
* **Request Body:** `{ "rating": 4, "comment": "Updated review comment" }`

### 5. Delete Review (Soft Delete)
* **Method:** `DELETE`
* **Endpoint:** `/api/reviews/:id`
* **Auth:** Protected (Bearer Token)

---

## 🛒 Order Endpoints (`/api/orders`)

### 1. Create Order
* **Method:** `POST`
* **Endpoint:** `/api/orders`
* **Auth:** Optional Auth *(If token is provided, `userId` comes from token; otherwise supply `userId` in body)*
* **Request Body:**
  ```json
  {
    "quantity": 2,
    "productId": "product-uuid",
    "userId": "user-uuid-if-unauthenticated"
  }
  ```

### 2. Get All Orders
* **Method:** `GET`
* **Endpoint:** `/api/orders`
* **Auth:** Optional Auth

### 3. Get Order By ID
* **Method:** `GET`
* **Endpoint:** `/api/orders/:id`
* **Auth:** Optional Auth

### 4. Update Order
* **Method:** `PATCH`
* **Endpoint:** `/api/orders/:id`
* **Auth:** Optional Auth
* **Request Body:** `{ "quantity": 3, "productId": "product-uuid" }`

### 5. Delete Order (Soft Delete)
* **Method:** `DELETE`
* **Endpoint:** `/api/orders/:id`
* **Auth:** Optional Auth
