import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js'; // <-- Add this

dotenv.config();

// Connect to Database
connectDB(); // <-- Add this

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[Server]: Running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err, promise) => {
  console.error(`[Unhandled Rejection]: ${err.message}`);
  server.close(() => process.exit(1));
});