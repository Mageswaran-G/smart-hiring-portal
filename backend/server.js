require('dotenv').config(); 

const config = require('./config');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
// Light — cheap operations
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: { success: false, message: 'Too many AI requests. Please wait 15 minutes.' }
});

// Heavy — expensive generation operations
const aiHeavyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many generation requests. Please wait 15 minutes.' }
});
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/v1/authRoutes');
const userRoutes = require('./routes/v1/userRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const xssMiddleware = require('./middleware/xssMiddleware');
const logger = require('./utils/logger');
const publicRoutes = require('./routes/v1/publicRoutes');
const jobRoutes = require('./routes/v1/jobRoutes');
const applicationRoutes = require('./routes/v1/applicationRoutes');
const savedJobRoutes = require('./routes/v1/savedJobRoutes');
const { startCronJobs } = require('./utils/cronJobs');
const aiRoutes = require('./routes/v1/aiRoutes')(aiHeavyLimiter);
const adminRoutes = require('./routes/v1/adminRoutes');



const app = express();

// Security headers
app.use(helmet());

// Restricted CORS
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json({ limit: '1mb' }));

// Serve uploaded files with CORS headers
// This allows frontend (port 5173) to load images from backend (port 8000)
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(require('path').join(__dirname, 'uploads')));

app.use(cookieParser());
app.use(xssMiddleware);

// Request logging with IP
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url} - ${req.ip}`);
  next();
});

// ─── Rate Limiters ────────────────────────────────────────────

// Strict limiter for login and signup only — prevents brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 10,                     // 10 login/signup attempts per 15 min
  message: { success: false, message: 'Too many requests, please try again later' }
});

// Generous limiter for refresh — user reloads browser many times normally
const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,                     // 60 refreshes per 15 min
  message: { success: false, message: 'Too many requests, please try again later' }
});

// API limiter for all job/application/saved routes
// Dashboard makes 3 calls per load. User navigates many pages.
// 500 per 15 min = safe for normal use while still blocking real abuse
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 500,                    // 500 API requests per 15 min (plenty for normal use)
  message: { success: false, message: 'Too many requests, slow down.' }
});

// Write limiter — for POST/PUT/DELETE that change data (still strict)
const writeLimiter = rateLimit({
  windowMs: 60 * 1000,         // 1 minute window
  max: 30,                     // 30 write operations per minute
  message: { success: false, message: 'Too many write requests, slow down.' },
  skip: (req) => req.method === 'GET', // Only count non-GET requests
});

// ─── Apply Rate Limiters ──────────────────────────────────────

// Auth routes — strict limits only on login + signup
app.use('/api/v1/auth/signup', authLimiter);
app.use('/api/v1/auth/login',  authLimiter);
app.use('/api/v1/auth/refresh', refreshLimiter);

// ─── Register Routes ──────────────────────────────────────────

app.use('/api/v1/auth',         authRoutes);
app.use('/api/v1/users',        userRoutes);
app.use('/api/v1/public',       publicRoutes);

// Apply generous read limiter + strict write limiter to API routes
app.use('/api/v1/jobs',         apiLimiter, writeLimiter, jobRoutes);
app.use('/api/v1/applications', apiLimiter, writeLimiter, applicationRoutes);
app.use('/api/v1/saved',        apiLimiter, writeLimiter, savedJobRoutes);
app.use("/api/v1/admin",        apiLimiter, adminRoutes);
app.use('/api/v1/ai', aiLimiter, aiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.get('/', (req, res) => {
  res.send('API is running');
});

app.use(errorHandler);

const PORT = config.port;

const startServer = async () => {
  try {
    await connectDB();
    startCronJobs();
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(`Failed to start: ${error.message}`);
    process.exit(1);
  }
};

startServer();