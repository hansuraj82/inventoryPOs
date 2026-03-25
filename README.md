# InventoryPOS - Inventory Management System with POS

A comprehensive full-stack web application for small retail shop owners to manage inventory and process point-of-sale (POS) transactions.

## Features

### Authentication
- Secure user registration and login
- JWT-based token authentication
- Password hashing with bcrypt
- User profile management

### Product Management
- Add, edit, delete, and view products
- Product fields: name, price, quantity, barcode, category, minimum stock
- Search products by name or barcode with debouncing
- Low stock alerts and notifications
- Category organization

### Barcode Scanning
- Integration with HTML5-QRCode for camera-based scanning
- Auto-fetch product details on barcode scan
- Fallback option to add new products if barcode not found

### Point of Sale (POS)
- Quick product search and selection
- Add multiple products to cart
- Adjust quantities in real-time
- Support for multiple payment methods (Cash, Card, UPI)
- Automatic change calculation
- Real-time stock deduction on sale completion

### Invoicing & Billing
- Professional invoice generation
- Print invoices directly to printer
- Download invoices as PDF
- Includes shop name, date/time, itemized list, totals
- Transaction history with expandable details

### Dashboard & Analytics
- Total sales today
- Total revenue metrics
- Product count
- Low stock alerts
- Quick navigation links

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Zustand** - State management
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **jsPDF & html2canvas** - PDF generation
- **html5-qrcode** - Barcode scanning

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin handling

## Project Structure

```
inventory-app/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   └── Sale.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   └── saleController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   └── saleRoutes.js
│   │   └── middleware/
│   │       ├── auth.js
│   │       └── errorHandler.js
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   ├── BarcodeScanner.jsx
│   │   │   └── Layout.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── POS.jsx
│   │   │   └── Sales.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── store/
│   │   │   └── store.js
│   │   ├── utils/
│   │   │   ├── helpers.js
│   │   │   └── invoice.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   ├── package.json
│   └── .gitignore
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud - MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/inventory-pos
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

5. Start development server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Usage

### First Time Setup

1. **Register Account**
   - Go to registration page
   - Fill in your details (name, email, phone, shop name)
   - Create a secure password
   - Click "Register"

2. **Login**
   - Use your registered email and password
   - You'll be redirected to the dashboard

3. **Add Products**
   - Go to "Products" page
   - Click "+ Add Product"
   - Fill in product details (name, price, quantity, barcode, category)
   - Click "Add" to save

4. **Process Sales**
   - Go to "POS" page
   - Search for products or use barcode scanner
   - Add products to cart
   - Adjust quantities as needed
   - Select payment method (Cash/Card/UPI)
   - Enter amount received
   - Complete payment
   - Print or download invoice

5. **View Sales History**
   - Go to "Sales" page
   - See all transactions
   - Expand transaction details
   - Print or download invoices

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Products
- `GET /api/products` - Get all products (protected)
- `GET /api/products/search?query=...` - Search products (protected)
- `GET /api/products/:id` - Get single product (protected)
- `GET /api/products/barcode/:barcode` - Get by barcode (protected)
- `POST /api/products` - Create product (protected)
- `PUT /api/products/:id` - Update product (protected)
- `DELETE /api/products/:id` - Delete product (protected)
- `GET /api/products/stats/low-stock` - Get low stock products (protected)

### Sales
- `GET /api/sales` - Get all sales (protected)
- `GET /api/sales/:id` - Get single sale (protected)
- `POST /api/sales` - Create sale (protected)
- `GET /api/sales/stats/today` - Today's stats (protected)
- `GET /api/sales/stats/dashboard` - Dashboard stats (protected)

## Features in Detail

### Search & Filter
- Real-time search with debouncing (500ms)
- Search by product name or barcode
- Results displayed instantly

### Barcode Scanner
- Click "📱 Scan" button to activate camera
- Point camera at barcode
- Automatic product detection and cart addition
- Error handling for non-existent barcodes

### Cart Management
- Add/remove products
- Adjust quantities with +/- buttons
- Real-time total calculation
- Clear entire cart

### Invoice Generation
- Professional, shop-branded invoices
- Includes all transaction details
- Print directly to printer
- Download as PDF format

### Dashboard Analytics
- Total products count
- Low stock product alerts
- Today's transaction count
- Today's revenue total

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt (10 salt rounds)
- Protected API routes with middleware
- Automatic token validation
- User isolation (each user sees only their data)
- Error handling and validation

## Browser Compatibility

- Chrome/Edge (recommended for barcode scanning)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- For MongoDB Atlas, ensure IP is whitelisted

### Barcode Scanner Not Working
- Check browser permissions for camera access
- Use HTTPS or localhost (required for camera access)
- Some browsers may require user permission

### Styling Issues
- Clear node_modules and reinstall: `npm install --save-post`
- Rebuild CSS: `npm run dev`
- Clear browser cache

### API Connection Failed
- Ensure backend is running on port 5000
- Check CORS settings in backend
- Verify proxy settings in vite.config.js

## Performance Optimization

- Debounced search (300-500ms)
- Lazy loading of components
- Zustand state management for efficient updates
- MongoDB indexes on frequently queried fields
- JWT token caching in localStorage

## Future Enhancements

- Role-based access (Admin/Staff)
- Sales reports and export to CSV/Excel
- Dark mode
- Multi-language support
- Inventory analytics and trends
- Customer management
- Supplier management
- Stock transfer between locations
- Advanced reporting
- Mobile app

## License

MIT

## Support

For issues or questions, contact support@inventorypos.com

## Deployment

### Backend (Using Heroku or Railway)
```bash
# Build and deploy
heroku create your-app-name
git push heroku main
```

### Frontend (Using Vercel or Netlify)
```bash
# Build
npm run build

# Deploy to Vercel
vercel deploy
```

Update API URL in frontend for production:
```javascript
// In frontend/src/services/api.js
const API_BASE = process.env.VITE_API_URL || '/api';
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ for small retail shop owners**
