import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import incidentRoutes from './routes/incident.routes.js';
import errorHandler from './middlewares/error.middleware.js';
import passport from './config/passport.js';

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);

// Central error handling
app.use(errorHandler);

export default app;
