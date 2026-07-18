import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import enquiryRoutes from './routes/enquiryRoutes';
import adminRoutes from './routes/adminRoutes';
import productRoutes from './routes/productRoutes';
import offerRoutes from './routes/offerRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL as string,
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Database Connection
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }
  if (!process.env.MONGO_URI) {
    console.error('FATAL ERROR: MONGO_URI is not defined.');
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_URI as string, {
      maxPoolSize: 10, // Prevent Free Tier connection limit exhaustion (max 500)
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = db.connections[0].readyState === 1;
    console.log('MongoDB Connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Routes
app.use('/api/enquiry', enquiryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/offers', offerRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start Server (only if not running in Vercel/serverless environment)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
