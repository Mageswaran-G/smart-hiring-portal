// import required packages
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

// initialize app
const app = express();

// load environment variables
dotenv.config();


// middleware
app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// test route to check if server is running
app.get('/', (req, res) => {
    res.send('API is running');
});


//port
const PORT = process.env.PORT || 8000;

// start server only after DB connects successfully
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, '127.0.0.1', () => {
      console.log(`Server running on http://127.0.0.1:${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();


