require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

const app = express();

// Deployment Environment Validation
if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET environment variable is missing.');
  process.exit(1);
}
if (!process.env.FRONTEND_URL && process.env.NODE_ENV === 'production') {
  console.warn('WARNING: FRONTEND_URL is not set. CORS may block frontend requests in production.');
}

// Set security HTTP headers
app.use(helmet());

// Start the server after the database is connected
const startServer = async () => {
  try {
    await connectDB();
    console.log('Database connection established successfully.');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  }
};

// Init Middleware
app.use(express.json());

// Configure CORS for production (allow frontend origin)
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5000', 'http://localhost:5173', process.env.FRONTEND_URL || '*'], credentials: true }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

app.get('/', (req, res) => res.send('API Running securely'));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/assessments', require('./routes/assessments'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/debug', require('./routes/debug'));

// Only launch the listener when run directly
if (require.main === module) {
  startServer();
}

module.exports = app;
