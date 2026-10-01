require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const { connectDB } = require('./config/db');
const setupPassport = require('./config/passport');
const { initCleanupCron } = require('./services/cleanupCron');
const errorHandler = require('./middleware/errorHandler');

// Route Handlers
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const documentRoutes = require('./routes/documentRoutes');
const searchRoutes = require('./routes/searchRoutes');
const insightsRoutes = require('./routes/insightsRoutes');
const chatRoutes = require('./routes/chatRoutes');
const exportRoutes = require('./routes/exportRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

const clientUrls = (process.env.CLIENT_URL || '')
  .split(',')
  .map((u) => u.trim())
  .filter(Boolean);

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  ...clientUrls,
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin, allowedOrigins, any .onrender.com domain, or in dev
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      origin.endsWith('.onrender.com') ||
      process.env.NODE_ENV !== 'production'
    ) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS security policy.'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-session-id', 'x-access-token'],
}));

// Body Parsers (Zero-retention: parse JSON & URL-encoded text safely)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Passport initialization
app.use(passport.initialize());
setupPassport();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Clause Intelligent Document Processing API',
    privacyGuarantee: 'Zero-Retention Active',
    timestamp: new Date().toISOString(),
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/export', exportRoutes);

// Centralized sanitized error handler
app.use(errorHandler);

// Start server and initialize database & cron
const startServer = async () => {
  try {
    await connectDB();
    initCleanupCron();

    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 CLAUSE IDP BACKEND RUNNING ON PORT ${PORT}`);
      console.log(`🛡️  ZERO-RETENTION GUARANTEE: ACTIVE`);
      console.log(`📡 API Endpoints available at http://localhost:${PORT}/api`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error(`[Server Start Error] ${err.message}`);
  }
};

startServer();

module.exports = app;
