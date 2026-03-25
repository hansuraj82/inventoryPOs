# File Tree & File Descriptions

## Project Structure

```
inventory-app/
├── backend/                          # Node.js Express Server & API
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.js              # User schema with password hashing
│   │   │   ├── Product.js           # Product inventory schema
│   │   │   └── Sale.js              # Sales transactions schema
│   │   ├── controllers/
│   │   │   ├── authController.js    # Login, register, auth logic
│   │   │   ├── productController.js # Product CRUD & search
│   │   │   └── saleController.js    # Sales processing & stats
│   │   ├── routes/
│   │   │   ├── authRoutes.js        # Auth endpoints
│   │   │   ├── productRoutes.js     # Product endpoints
│   │   │   └── saleRoutes.js        # Sales endpoints
│   │   └── middleware/
│   │       ├── auth.js              # JWT verification middleware
│   │       └── errorHandler.js      # Global error handling
│   ├── server.js                    # Main Express app setup
│   ├── package.json                 # Backend dependencies
│   ├── .env                         # Environment variables
│   ├── .env.example                 # Example env template
│   ├── .gitignore                   # Git ignore rules
│   ├── Dockerfile                   # Docker image config
│   └── README.md                    # Backend documentation
│
├── frontend/                         # React + Vite Frontend App
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Navigation bar
│   │   │   ├── PrivateRoute.jsx     # Protected route wrapper
│   │   │   ├── BarcodeScanner.jsx   # Barcode camera interface
│   │   │   └── Layout.jsx           # Main layout wrapper
│   │   ├── pages/
│   │   │   ├── Login.jsx            # Login page
│   │   │   ├── Register.jsx         # Registration page
│   │   │   ├── Dashboard.jsx        # Main dashboard
│   │   │   ├── Products.jsx         # Product management
│   │   │   ├── POS.jsx              # Point of sale interface
│   │   │   └── Sales.jsx            # Sales history view
│   │   ├── services/
│   │   │   └── api.js               # Axios API client
│   │   ├── store/
│   │   │   └── store.js             # Zustand state management
│   │   ├── utils/
│   │   │   ├── helpers.js           # Utility functions
│   │   │   └── invoice.js           # PDF generation
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Global styles
│   ├── public/                      # Static assets
│   ├── vite.config.js               # Vite configuration
│   ├── tailwind.config.js            # Tailwind CSS config
│   ├── postcss.config.js            # PostCSS configuration
│   ├── index.html                   # HTML template
│   ├── package.json                 # Frontend dependencies
│   ├── .gitignore                   # Git ignore rules
│   ├── Dockerfile                   # Docker image config
│   └── README.md                    # Frontend documentation
│
├── Documentation Files
│   ├── README.md                    # Complete project guide
│   ├── QUICKSTART.md                # Quick setup instructions
│   ├── API_DOCUMENTATION.md         # Full API reference
│   ├── DEPLOYMENT.md                # Production deployment guide
│   ├── PROJECT_SUMMARY.md           # Project overview
│   └── FILE_TREE.md                 # This file
│
├── Setup & Config Files
│   ├── package.json                 # Root npm configuration
│   ├── docker-compose.yml           # Docker multi-container setup
│   ├── setup.sh                     # Mac/Linux setup script
│   ├── setup.bat                    # Windows setup script
│   └── .gitignore                   # Git ignore for root
│
└── Notes
    └── README.md (root)             # Start here!
```

## File Descriptions

### Backend Files

#### Core Server
- **server.js**: Main Express application entry point. Sets up routes, middleware, error handling, and MongoDB connection.

#### Models (Database Schemas)

- **models/User.js**: 
  - Schema: name, email, phone, shopName, password, role
  - Methods: `matchPassword()` for authentication
  - Middleware: Auto-hashes password before saving

- **models/Product.js**:
  - Schema: name, price, quantity, barcode, category, minStock
  - Fields: sku, description, timestamps
  - Indexes: For fast text search

- **models/Sale.js**:
  - Schema: items[], totalAmount, paymentMethod, paidAmount, change
  - Tracks: transaction details with timestamps

#### Controllers (Business Logic)

- **controllers/authController.js**:
  - `register()`: Create new user account
  - `login()`: Authenticate and return JWT token
  - `getCurrentUser()`: Get authenticated user profile

- **controllers/productController.js**:
  - `getProducts()`: Fetch all user products
  - `searchProducts()`: Search by name/barcode
  - `getProduct()`: Fetch single product
  - `getProductByBarcode()`: Get product from barcode
  - `createProduct()`: Add new product
  - `updateProduct()`: Modify existing product
  - `deleteProduct()`: Remove product
  - `getLowStockProducts()`: Get products below minimum

- **controllers/saleController.js**:
  - `createSale()`: Process a transaction
  - `getSales()`: Get all transactions
  - `getSale()`: Get single transaction
  - `getTodaySales()`: Today's statistics
  - `getDashboardStats()`: Overall analytics

#### Routes (API Endpoints)

- **routes/authRoutes.js**: `/api/auth` endpoints
- **routes/productRoutes.js**: `/api/products` endpoints
- **routes/saleRoutes.js**: `/api/sales` endpoints

#### Middleware

- **middleware/auth.js**:
  - `protect`: Verify JWT token
  - `authorize`: Check user roles

- **middleware/errorHandler.js**:
  - Global error handling
  - Format error responses

### Frontend Files

#### Components

- **Navbar.jsx**: Navigation bar with user info and logout
- **PrivateRoute.jsx**: Protected route wrapper for authentication
- **BarcodeScanner.jsx**: Barcode input modal with camera
- **Layout.jsx**: Main layout wrapper with navbar

#### Pages

- **Login.jsx**: User login form
- **Register.jsx**: User registration form
- **Dashboard.jsx**: Main dashboard with stats
- **Products.jsx**: Product management interface
- **POS.jsx**: Point of Sale checkout system
- **Sales.jsx**: Transaction history view

#### Services

- **services/api.js**: 
  - Axios instance with interceptors
  - Auth, Product, Sale API methods
  - Automatic token injection
  - 401 error handling

#### State Management

- **store/store.js**:
  - `useAuthStore`: User authentication state
  - `useProductStore`: Product inventory state
  - `useCartStore`: Shopping cart state

#### Utilities

- **utils/helpers.js**:
  - `formatCurrency()`: Format numbers as currency
  - `formatDate()`: Format dates and times
  - `debounce()`: Debounce function calls
  - `validateEmail()`: Email validation
  - `validatePhone()`: Phone validation

- **utils/invoice.js**:
  - `generateInvoicePDF()`: Create PDF invoice
  - `downloadInvoice()`: Download PDF file
  - `printInvoice()`: Print invoice directly

#### Styling & Config

- **index.css**: Global styles with Tailwind utilities
- **tailwind.config.js**: Tailwind customization
- **postcss.config.js**: CSS processing pipeline
- **vite.config.js**: Vite build configuration

### Configuration Files

- **package.json (backend)**: Node.js dependencies and scripts
- **package.json (frontend)**: React dependencies and scripts
- **package.json (root)**: Workspace management scripts
- **docker-compose.yml**: Multi-container Docker setup
- **.env (backend)**: Environment variables for development
- **.env.example**: Template for environment variables
- **.gitignore**: Git ignore patterns

### Documentation

- **README.md**: Complete project documentation with setup instructions
- **QUICKSTART.md**: Quick start guide for immediate setup
- **API_DOCUMENTATION.md**: Detailed API endpoint reference
- **DEPLOYMENT.md**: Production deployment instructions
- **PROJECT_SUMMARY.md**: Project overview and features
- **FILE_TREE.md**: This file - file structure and descriptions

### Setup Scripts

- **setup.sh**: Automated setup for Mac/Linux
- **setup.bat**: Automated setup for Windows
- **docker-compose.yml**: Single-command Docker setup

## Dependencies Overview

### Backend
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT handling
- **bcryptjs**: Password hashing
- **cors**: CORS handling
- **joi**: Data validation
- **dotenv**: Environment variables
- **nodemon**: Development auto-reload

### Frontend
- **react**: UI library
- **react-router-dom**: Navigation
- **axios**: HTTP client
- **zustand**: State management
- **tailwindcss**: Styling
- **react-hot-toast**: Notifications
- **jspdf**: PDF generation
- **html2canvas**: Screenshot utility
- **html5-qrcode**: Barcode scanning
- **vite**: Build tool
- **postcss**: CSS processing

## Size & Complexity

- **Total Lines of Code**: ~2,500+
- **React Components**: 10
- **API Endpoints**: 15+
- **Database Models**: 3
- **Pages/Routes**: 6
- **Database Collections**: 3

## Module Usage Guidelines

### When to Use Each Component

**Navbar.jsx**: On all protected pages
**Layout.jsx**: Wrap protected pages with it
**PrivateRoute.jsx**: Protect route definitions
**BarcodeScanner.jsx**: On POS page for scanning

### When to Use Each Store

**useAuthStore**: Check login status, get user info
**useProductStore**: Manage product list
**useCartStore**: Manage shopping cart

### When to Use Each Utility

**helpers.js**: Formatting and validation
**invoice.js**: Generate and download invoices
**api.js**: Make API calls

## Code Quality Standards

✅ Consistent naming conventions
✅ Modular file structure
✅ Reusable components
✅ Error handling
✅ Input validation
✅ Security best practices
✅ Performance optimization
✅ Responsive design

---

For detailed information about specific files, see their inline comments and docstrings.
