const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const { xssClean } = require('./middleware/xssMiddleware');
const logger = require('./utils/logger');

dotenv.config();

const app = express();

// Security headers
app.use(helmet());

// Restricted CORS
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());




// XSS protection
app.use(xssClean);

// Request logging with IP
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url} - ${req.ip}`);
  next();
});

// Strict limiter for login and signup only
// Prevents brute force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  }
});

// Generous limiter for refresh
// User can refresh browser many times normally
const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,  // 60 refreshes per 15 minutes = plenty
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  }
});

// Apply strict limit only to signup and login
// Apply generous limit to refresh
app.use('/api/v1/auth/signup', authLimiter);
app.use('/api/v1/auth/login', authLimiter);
app.use('/api/v1/auth/refresh', refreshLimiter);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.get('/', (req, res) => {
  res.send('API is running');
});

app.use(errorHandler);

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(`Failed to start: ${error.message}`);
    process.exit(1);
  }
};

startServer();