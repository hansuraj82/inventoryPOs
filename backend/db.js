const mongoose = require('mongoose');

const connectDB = async () => {
  // Check if MongoDB URI is provided
  if (!process.env.MONGODB_URI) {
    console.error('ERROR: MONGODB_URI environment variable is not set');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ MongoDB connected successfully');

    // Connection event listeners
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠ MongoDB disconnected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('✗ MongoDB error:', err.message);
    });

  } catch (err) {
    console.error('✗ MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
