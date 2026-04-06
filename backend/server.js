import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import forestDataRoutes from './routes/forestData.js';
import issueReportRoutes from './routes/issueReports.js';

dotenv.config();

const app = express();

/* ======================
   Request Logger
====================== */
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

/* ======================
   Middleware
====================== */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ======================
   Routes
====================== */
app.use('/api/auth', authRoutes);
app.use('/api/forest-data', forestDataRoutes);
app.use('/api/issue-reports', issueReportRoutes);

/* ======================
   Health Check
====================== */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'OK',
    message: 'Forest Guardian API is running',
  });
});

/* ======================
   404 Handler
====================== */
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

/* ======================
   Global Error Handler
====================== */
app.use(errorHandler);

/* ======================
   Server & Database
====================== */
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

export default app;
