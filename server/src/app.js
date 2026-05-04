import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import incidentRoutes from './routes/incident.routes.js';
import workspaceRoutes from './routes/workspace.routes.js';
import serviceRoutes from './routes/service.routes.js';
import statusRoutes from './routes/status.routes.js';
import aiRoutes from './routes/ai.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import errorHandler from './middlewares/error.middleware.js';
import passport from './config/passport.js';
import { globalLimiter } from './middlewares/rateLimit.middleware.js';
import helmet from 'helmet';
import mongoSanitize from '@exortek/express-mongo-sanitize';
import { xss } from 'express-xss-sanitizer';
import pinoHttp from 'pino-http';
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
app.set('trust proxy', 1);
const corsOptions = {
  origin: config.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Logger
app.use(
  pinoHttp({
    transport:
      process.env.NODE_ENV === 'production'
        ? undefined
        : {
            target: 'pino-pretty',
            options: {
              colorize: true,
              ignore: 'pid,hostname,req,res',
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
app.use('/api/incidents', incidentRoutes);
app.use('/api/workspace', workspaceRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);

// Central error handling
app.use(errorHandler);

export default app;
