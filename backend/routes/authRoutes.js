// backend/routes/authRoutes.js
import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { sendResetLinkEmail } from '../services/emailService.js';
import crypto from 'crypto';

const router = express.Router();

// ==========================
// 🔹 REGISTER ROUTE
// ==========================
router.post('/register', async (req, res) => {
  try {
    let { name, email, password } = req.body;

    // ✅ Normalize email (simple fix)
    const userEmail = email.toLowerCase().trim();

    // Check if user already exists
    const userExists = await User.findOne({ email: userEmail });
    if (userExists) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    // Create new user
    const newUser = await User.create({
      name,
      email: userEmail,
      password,
      role: userEmail === 'admin@adikart.com' ? 'admin' : 'user'
    });

    // Map _id to id for frontend
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

// ==========================
// 🔹 LOGIN ROUTE
// ==========================
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;
    const userEmail = email.toLowerCase().trim(); // normalize email

    // Find user
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      console.log(`Login failed: No user found for ${userEmail}`);
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log(`Login failed: Password mismatch for ${userEmail}`);
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Successful login
    const userToReturn = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    return res.json(userToReturn);

  } catch (error) {
    console.error("CRITICAL LOGIN ERROR:", error);
    return res.status(500).json({ message: 'Login failed due to server error.' });
  }
});

export default router;
