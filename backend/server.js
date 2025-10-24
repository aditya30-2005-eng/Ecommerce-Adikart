// backend/server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js'; 
import { seedAdminUser } from './config/adminSeeder.js'; 

dotenv.config(); // Loads secrets from .env

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// CRITICAL: Increased payload size limit and CORS configuration
app.use(cors({ 
    origin: 'http://localhost:3000', // Allow frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
})); 
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true })); 

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    // Run Admin Seeder logic here (Requires User model)
    // NOTE: Ensure your Admin Seeder is not imported if User model fails, but in this setup it is required.
    // seedAdminUser(); 
  })
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes); 

app.get('/', (req, res) => {
  res.send('Adikart API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});