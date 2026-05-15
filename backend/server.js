const config = require('./config');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
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
const jobActionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 30,                    // 30 job actions per 15 min
  message: { success: false, message: 'Too many requests, slow down.' }
});

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
app.use('/api/v1/public', publicRoutes);
app.use('/api/v1/jobs',         jobRoutes);


app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/saved', savedJobRoutes);

app.use('/api/v1/jobs',         jobActionLimiter);
app.use('/api/v1/applications', jobActionLimiter);
app.use('/api/v1/saved',        jobActionLimiter);

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