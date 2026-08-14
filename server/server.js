import 'dotenv/config';

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import ticketRoutes from './routes/ticketRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import authRoutes, {
  ensureAdmin
} from './routes/authRoutes.js';

import { errorHandler, notFound } from './middleware/errorHandler.js';
import { protect } from './middleware/authMiddleware.js';

const app = express();

const PORT = process.env.PORT || 5000;

app.use(helmet());

app.use(
  cors({
    origin:
      process.env.CLIENT_URL
        ?.split(',')
        .map((v) => v.trim()) || '*',
    credentials: false
  })
);

app.use(express.json({ limit: '1mb' }));

app.use(morgan('dev'));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false
  })
);


/*
 * Public health endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    service: 'SupportFlow API',
    time: new Date().toISOString()
  });
});


/*
 * Public authentication endpoint
 */
app.use('/api/auth', authRoutes);


/*
 * Protected CRM APIs
 */
app.use('/api/tickets', protect, ticketRoutes);

app.use('/api/ai', protect, aiRoutes);


app.use(notFound);
app.use(errorHandler);


mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {

    console.log('MongoDB connected');

    await ensureAdmin();

    app.listen(PORT, () => {
      console.log(
        `SupportFlow API running on port ${PORT}`
      );
    });

  })
  .catch((err) => {
    console.error(
      'MongoDB connection failed:',
      err.message
    );

    process.exit(1);
  });