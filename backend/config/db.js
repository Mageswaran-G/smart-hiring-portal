// Import mongoose to connect to MongoDB
const mongoose = require('mongoose');

// Async function to connect database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Export function so server.js can use it
module.exports = connectDB;