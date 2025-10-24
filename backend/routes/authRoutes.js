// backend/routes/authRoutes.js
import express from 'express';
import User from '../models/User.js'; 
import bcrypt from 'bcryptjs'; 
import { sendResetLinkEmail } from '../services/emailService.js';
import crypto from 'crypto';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const newUser = await User.create({ 
        name, 
        email, 
        password, 
        role: email.toLowerCase() === 'admin@adikart.com' ? 'admin' : 'user' 
    });

    // Map _id to id for frontend compatibility
    const userToReturn = { 
        id: newUser._id, 
        name: newUser.name, 
        email: newUser.email, 
        role: newUser.role 
    };
    return res.status(201).json(userToReturn); 
    
  } catch (error) {
    console.error("CRITICAL REGISTRATION ERROR:", error); 
    
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Registration failed: Missing required fields.' });
    }
    
    return res.status(500).json({ message: 'Registration failed due to server error.' }); 
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
        console.log(`Login attempt failed: User not found for email ${email}`);
        return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Compare the provided password with the hashed password in DB
    const isMatch = await user.comparePassword(password);

    if (isMatch) {
      // Successful login
      const userToReturn = { 
          id: user._id, 
          name: user.name, 
          email: user.email, 
          role: user.role 
      };
      return res.json(userToReturn); 
    } else {
      // Log failed password comparison
      console.log(`Login attempt failed: Password mismatch for email ${email}`);
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

  } catch (error) {
    console.error("CRITICAL LOGIN ERROR:", error);
    return res.status(500).json({ message: 'Login failed due to server error.' });
  }
});

// ... (Forgot and Reset Password routes remain the same)

export default router;