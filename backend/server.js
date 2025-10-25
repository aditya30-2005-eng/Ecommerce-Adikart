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

// CRITICAL FIX: Update CORS to allow all necessary origins including Netlify
const allowedOrigins = [
    'http://localhost:3000', 
    // Add the deployed backend URL to allow self-requests and internal services
    'https://ecommerce-adikart.onrender.com', 
];

app.use(cors({ 
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, Postman) and server-to-server requests
        if (!origin) return callback(null, true);

        // Allow explicitly allowed origins
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        
        // Allow all Netlify deployments (most critical fix for frontend)
        if (origin.endsWith('.netlify.app')) {
            return callback(null, true);
        }

        // Block other origins
        callback(new Error('Not allowed by CORS: ' + origin), false);
    },
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