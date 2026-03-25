# Quick Start Guide for InventoryPOS

## Prerequisites
- Node.js v14+ installed
- MongoDB installed locally or MongoDB Atlas account
- npm or yarn

## Setup Instructions

### Step 1: Install MongoDB

**Option A: Local Installation**
- Download from https://www.mongodb.com/try/download/community
- Install and ensure MongoDB service is running

**Option B: MongoDB Atlas Cloud**
1. Create account at https://www.mongodb.com/atlas
2. Create a free cluster
3. Get connection string
4. Update MONGODB_URI in backend/.env

### Step 2: Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# The .env file is already created with defaults
# You can customize it if needed

# Start the development server
npm run dev
# Server runs on http://localhost:5000
```

### Step 3: Frontend Setup (In a new terminal)

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
# App runs on http://localhost:3000
```

### Step 4: Access the Application

1. Open your browser to: `http://localhost:3000`
2. Register a new account with your shop details
3. Login with your credentials
4. Start managing your inventory!

## Quick Test

After setup, try these steps:

1. **Add a Product**
   - Go to Products page
   - Click "+ Add Product"
   - Add: Name: "Test Product", Price: 100, Quantity: 10
   - Save

2. **Process a Sale**
   - Go to POS page
   - Click on "Test Product"
   - Set quantity: 2
   - Enter payment method and amount
   - Complete payment
   - Download invoice

3. **View Sales History**
   - Go to Sales page
   - See your completed transaction
   - Download or print invoice

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### MongoDB Connection Error
```bash
# Check if MongoDB is running
# Windows: Check Services for MongoDB
# macOS: brew services list
# Linux: sudo systemctl status mongod

# Or use MongoDB Atlas connection string in .env
```

### Dependencies Not Installing
```bash
# Clear npm cache and try again
npm cache clean --force
npm install
```

## Default Configuration

- Backend: http://localhost:5000
- Frontend: http://localhost:3000
- Database: mongodb://localhost:27017/inventory-pos
- JWT Secret: (configured in .env)

## File Locations

- Backend code: `backend/src/`
- Frontend code: `frontend/src/`
- Database models: `backend/src/models/`
- API controllers: `backend/src/controllers/`
- React pages: `frontend/src/pages/`

## Next Steps

1. Customize look & feel (colors, fonts) in `tailwind.config.js`
2. Add more payment methods
3. Customize shop name and branding
4. Configure email notifications
5. Set up backup system

For more information, see README.md

---
Happy selling! 🚀
