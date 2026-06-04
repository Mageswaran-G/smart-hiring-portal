require('dotenv').config(); 

const config = require('./config');
const express = require('express');

const cors = require('cors');
const helmet = require('helmet');


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
const aiRoutes = require('./routes/v1/aiRoutes');
const adminRoutes = require("./routes/v1/adminRoutes");
const chatRoutes  = require("./routes/v1/chatRoutes");
const { generateCsrfToken, validateCsrf } = require('./middleware/csrfMiddleware');


const app = express();
app.set('trust proxy', 1);

const compression = require('compression');
app.use(compression());

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

// CSRF validation — protects all POST/PUT/DELETE routes
// Excludes: GET, HEAD, OPTIONS (safe methods)
// Excludes: /auth/refresh and /auth/login (cookie-based, no CSRF needed)

app.use((req, res, next) => {
  const excluded = ['/api/v1/auth/refresh', '/api/v1/auth/login', '/api/v1/auth/signup', '/api/v1/auth/logout', '/api/v1/auth/csrf-token'];
  if (excluded.some(path => req.path.startsWith(path))) return next();
  return validateCsrf(req, res, next);
});

// Request logging with IP
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url} - ${req.ip}`);
  next();
});

const { authLimiter, refreshLimiter, apiLimiter, writeLimiter, aiLimiter } = require('./middleware/rateLimiters');

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
app.use('/api/v1/ai',   aiLimiter, aiRoutes);
app.use('/api/v1/chat', apiLimiter, writeLimiter, chatRoutes);

// CSRF token endpoint — frontend calls this on app load
app.get('/api/v1/auth/csrf-token', generateCsrfToken);

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