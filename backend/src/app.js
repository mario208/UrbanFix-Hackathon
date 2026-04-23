import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import healthRoutes from './routes/healthRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

const app = express();

// --- Global Middlewares ---
// Secure HTTP headers
app.use(helmet()); 
// Allow cross-origin requests from the React frontend
app.use(cors()); 
// Parse incoming JSON payloads
app.use(express.json()); 
// Parse URL-encoded data
app.use(express.urlencoded({ extended: true })); 
// HTTP request logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); 
}

// --- Mount Routes ---
// Base URL for health checks
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);

// --- 404 Fallback Handler ---
app.use((req, res, next) => {
  res.status(404);
  const error = new Error(`Route Not Found - ${req.originalUrl}`);
  next(error);
});

// --- Global Error Handling ---
app.use(errorHandler);

export default app;