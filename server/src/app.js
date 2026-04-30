import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import incidentRoutes from './routes/incident.routes.js';
import workspaceRoutes from './routes/workspace.routes.js';
import errorHandler from './middlewares/error.middleware.js';
import passport from './config/passport.js';
import { globalLimiter } from './middlewares/rateLimit.middleware.js';
import helmet from 'helmet';
import mongoSanitize from '@exortek/express-mongo-sanitize';
import { xss } from 'express-xss-sanitizer';
import pinoHttp from 'pino-http';
import { apiLimiter } from './middlewares/rateLimit.middleware.js';
import { authenticate } from './middlewares/auth.middleware.js';
import { config } from './config/config.js';

const app = express();

app.set('trust proxy', 1);

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// CORS
app.use(
  cors({
    origin: config.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  })
);

// Logger
app.use(
  pinoHttp({
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        ignore: 'pid,hostname,req,res', // 👈 removes big clutter
      },
    },
    redact: ['req.headers.cookie', 'req.headers.authorization'],
    customSuccessMessage: (req, res) =>
      `${req.method} ${req.url} -> ${res.statusCode}`,

    customErrorMessage: (req, res, err) =>
      `${req.method} ${req.url} -> ${res.statusCode} ❌ ${err?.message}`,
  })
);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Rate limiting
app.use(globalLimiter);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Sanitization
app.use(
  mongoSanitize({
    replaceWith: '_',
  })
);
app.use(xss());

// Auth init
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', authenticate, apiLimiter);
app.use('/api/incidents', incidentRoutes);
app.use('/api/workspace', workspaceRoutes);

// Central error handling
app.use(errorHandler);

export default app;
