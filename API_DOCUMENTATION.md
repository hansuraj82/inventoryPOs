# API Documentation - InventoryPOS

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Response Format
All responses return JSON with the following structure:
```json
{
  "success": true/false,
  "message": "Optional message",
  "data": {},
  "token": "JWT token (on auth endpoints)"
}
```

---

## Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

Register a new shop owner account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "shopName": "My Shop",
  "password": "password123",
  "passwordConfirm": "password123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "63f8d9c7e4b1a2f0k3h9p2q1",
    "name": "John Doe",
    "email": "john@example.com",
    "shopName": "My Shop",
    "role": "admin"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Email already in use"
}
```

---

### 2. Login User
**POST** `/auth/login`

Authenticate and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "63f8d9c7e4b1a2f0k3h9p2q1",
    "name": "John Doe",
    "email": "john@example.com",
    "shopName": "My Shop",
    "role": "admin"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### 3. Get Current User
**GET** `/auth/me` (Protected)

Get authenticated user's profile.

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "63f8d9c7e4b1a2f0k3h9p2q1",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "shopName": "My Shop",
    "role": "admin"
  }
}
```

---

## Product Endpoints

### 1. Get All Products
**GET** `/products` (Protected)

Retrieve all products for the logged-in user.

**Success Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "63f8d9c7e4b1a2f0k3h9p2q1",
      "name": "Laptop",
      "price": 50000,
      "quantity": 10,
      "barcode": "BAR123456",
      "category": "Electronics",
      "minStock": 5,
      "createdAt": "2023-08-15T10:30:00.000Z"
    }
  ]
}
```

---

### 2. Search Products
**GET** `/products/search?query=laptop` (Protected)

Search products by name or barcode.

**Query Parameters:**
- `query` (string, required) - Search term

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "63f8d9c7e4b1a2f0k3h9p2q1",
      "name": "Laptop",
      "price": 50000,
      "quantity": 10,
      "barcode": "BAR123456",
      "category": "Electronics",
      "minStock": 5
    }
  ]
}
```

---

### 3. Get Product by ID
**GET** `/products/:id` (Protected)

Get a specific product.

**URL Parameters:**
- `id` (string, required) - Product ID

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "63f8d9c7e4b1a2f0k3h9p2q1",
    "name": "Laptop",
    "price": 50000,
    "quantity": 10,
    "barcode": "BAR123456",
    "category": "Electronics",
    "minStock": 5,
    "description": "High-performance laptop",
    "sku": "SKU123"
  }
}
```

---

### 4. Get Product by Barcode
**GET** `/products/barcode/:barcode` (Protected)

Get product using barcode.

**URL Parameters:**
- `barcode` (string, required) - Product barcode

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "63f8d9c7e4b1a2f0k3h9p2q1",
    "name": "Laptop",
    "price": 50000,
    "quantity": 10,
    "barcode": "BAR123456",
    "category": "Electronics"
  }
}
```

---

### 5. Create Product
**POST** `/products` (Protected)

Add a new product.

**Request Body:**
```json
{
  "name": "Laptop",
  "price": 50000,
  "quantity": 10,
  "barcode": "BAR123456",
  "category": "Electronics",
  "minStock": 5,
  "sku": "SKU123",
  "description": "High-performance laptop"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "63f8d9c7e4b1a2f0k3h9p2q1",
    "name": "Laptop",
    "price": 50000,
    "quantity": 10,
    "barcode": "BAR123456",
    "category": "Electronics",
    "minStock": 5,
    "createdAt": "2023-08-15T10:30:00.000Z"
  }
}
```

---

### 6. Update Product
**PUT** `/products/:id` (Protected)

Update an existing product.

**URL Parameters:**
- `id` (string, required) - Product ID

**Request Body:**
```json
{
  "price": 55000,
  "quantity": 15,
  "minStock": 6
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "63f8d9c7e4b1a2f0k3h9p2q1",
    "name": "Laptop",
    "price": 55000,
    "quantity": 15,
    "barcode": "BAR123456",
    "category": "Electronics",
    "minStock": 6,
    "updatedAt": "2023-08-15T11:00:00.000Z"
  }
}
```

---

### 7. Delete Product
**DELETE** `/products/:id` (Protected)

Delete a product.

**URL Parameters:**
- `id` (string, required) - Product ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

### 8. Get Low Stock Products
**GET** `/products/stats/low-stock` (Protected)

Get all products with quantity less than or equal to minimum stock.

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "63f8d9c7e4b1a2f0k3h9p2q1",
      "name": "Mouse",
      "quantity": 3,
      "minStock": 5,
      "price": 500
    }
  ]
}
```

---

## Sales Endpoints

### 1. Get All Sales
**GET** `/sales` (Protected)

Retrieve all sales transactions.

**Success Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "63f8d9c7e4b1a2f0k3h9p2q2",
      "items": [
        {
          "product": "63f8d9c7e4b1a2f0k3h9p2q1",
          "productName": "Laptop",
          "quantity": 1,
          "price": 50000,
          "subtotal": 50000
        }
      ],
      "totalAmount": 50000,
      "paymentMethod": "cash",
      "paidAmount": 50000,
      "change": 0,
      "createdAt": "2023-08-15T10:30:00.000Z"
    }
  ]
}
```

---

### 2. Get Single Sale
**GET** `/sales/:id` (Protected)

Get a specific sale transaction.

**URL Parameters:**
- `id` (string, required) - Sale ID

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "63f8d9c7e4b1a2f0k3h9p2q2",
    "items": [
      {
        "product": "63f8d9c7e4b1a2f0k3h9p2q1",
        "productName": "Laptop",
        "quantity": 1,
        "price": 50000,
        "subtotal": 50000
      }
    ],
    "totalAmount": 50000,
    "paymentMethod": "cash",
    "paidAmount": 50000,
    "change": 0,
    "createdAt": "2023-08-15T10:30:00.000Z"
  }
}
```

---

### 3. Create Sale
**POST** `/sales` (Protected)

Create a new sale transaction.

**Request Body:**
```json
{
  "items": [
    {
      "product": "63f8d9c7e4b1a2f0k3h9p2q1",
      "quantity": 1,
      "price": 50000
    },
    {
      "product": "63f8d9c7e4b1a2f0k3h9p2q3",
      "quantity": 2,
      "price": 500
    }
  ],
  "totalAmount": 51000,
  "paymentMethod": "cash",
  "paidAmount": 51000,
  "notes": "Regular customer"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "63f8d9c7e4b1a2f0k3h9p2q2",
    "items": [
      {
        "product": "63f8d9c7e4b1a2f0k3h9p2q1",
        "productName": "Laptop",
        "quantity": 1,
        "price": 50000,
        "subtotal": 50000
      }
    ],
    "totalAmount": 51000,
    "paymentMethod": "cash",
    "paidAmount": 51000,
    "change": 0,
    "createdAt": "2023-08-15T10:30:00.000Z"
  }
}
```

---

### 4. Get Today Sales Stats
**GET** `/sales/stats/today` (Protected)

Get sales statistics for today.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 105000,
    "totalTransactions": 2,
    "sales": [
      {
        "_id": "63f8d9c7e4b1a2f0k3h9p2q2",
        "totalAmount": 50000,
        "paymentMethod": "cash",
        "createdAt": "2023-08-15T10:30:00.000Z"
      }
    ]
  }
}
```

---

### 5. Get Dashboard Stats
**GET** `/sales/stats/dashboard` (Protected)

Get overall dashboard statistics.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalProducts": 50,
    "lowStockProducts": 3,
    "todaySales": 2,
    "todayRevenue": 105000,
    "topProducts": [
      {
        "_id": "63f8d9c7e4b1a2f0k3h9p2q1",
        "name": "Laptop",
        "quantity": 15,
        "price": 50000
      }
    ]
  }
}
```

---

## Error Handling

### Common Error Responses

**400 Bad Request**
```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

**401 Unauthorized**
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

**404 Not Found**
```json
{
  "success": false,
  "message": "Product not found"
}
```

**500 Server Error**
```json
{
  "success": false,
  "message": "Server Error"
}
```

---

## Rate Limiting
No rate limiting implemented (add in production).

## Pagination
Not implemented (add for large datasets).

## Filtering & Sorting
- Products can be searched by name or barcode
- Sales are sorted by date (newest first)

---

## Testing Endpoints

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "shopName": "My Shop",
    "password": "password123",
    "passwordConfirm": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Get Products:**
```bash
curl -X GET http://localhost:5000/api/products \
  -H "Authorization: Bearer <your_token>"
```

---

## Integration Notes

- All protected endpoints require valid JWT token
- Token expires after 7 days
- Each user can only access their own data
- File uploads not supported (use direct input)
- Pagination not implemented (implement for large datasets)

---

For more information, see README.md
