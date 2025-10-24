// backend/routes/paymentRoutes.js
import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto'; 
import dotenv from 'dotenv'; // <-- CRITICAL FIX: Import dotenv

dotenv.config(); // <-- CRITICAL FIX: Ensure environment variables are loaded

const router = express.Router();

// Initialize Razorpay client using environment variables
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
});

// 1. POST /api/payment/order - Creates a new order ID
router.post('/order', async (req, res) => {
    const { amount, currency = "INR" } = req.body; 

    if (!amount || amount < 100) { 
        return res.status(400).json({ message: "Invalid amount specified." });
    }

    const options = {
        amount: amount, 
        currency: currency,
        receipt: crypto.randomBytes(10).toString('hex'), 
    };

    try {
        const order = await razorpayInstance.orders.create(options);
        res.json({
            id: order.id, 
            currency: order.currency,
            amount: order.amount,
            key_id: process.env.RAZORPAY_KEY_ID // Send public key to frontend for modal
        });
    } catch (error) {
        console.error("Razorpay Order Creation Failed:", error);
        res.status(500).json({ message: "Failed to create payment order.", error });
    }
});

// 2. POST /api/payment/verify - Verifies the payment signature
router.post('/verify', async (req, res) => {
    const { 
        razorpay_order_id, 
        razorpay_payment_id, 
        razorpay_signature 
    } = req.body;

    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest === razorpay_signature) {
        res.json({ message: "Payment successful and verified." });
    } else {
        res.status(400).json({ message: "Payment verification failed." });
    }
});

export default router;