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

// ==========================
// 🆕 FORGOT PASSWORD ROUTE (Start reset flow - sends email)
// ==========================
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const userEmail = email.toLowerCase().trim();

    try {
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            // Send a general success message to avoid revealing which emails are registered.
            return res.status(200).json({ message: 'If an account exists for this email, a password reset link has been sent.' });
        }

        // Generate token and save to DB (requires getResetPasswordToken method in User model)
        const resetToken = user.getResetPasswordToken();
        await user.save();
        
        // Determine the frontend URL (Assuming Netlify deployment)
        const origin = req.headers.origin || req.headers.host;
        let frontendBaseUrl = origin ? (origin.startsWith('http') ? origin : `https://${origin}`) : 'http://localhost:3000';
        
        // The frontend ResetPassword component expects a URL parameter: /resetpassword?token=
        const resetLink = `${frontendBaseUrl}/resetpassword?token=${resetToken}`;
        
        const emailSent = await sendResetLinkEmail(user.email, resetLink);

        if (!emailSent) {
             // Rollback the token generation if email failed (optional but good practice)
             user.resetPasswordToken = undefined;
             user.resetPasswordExpire = undefined;
             await user.save();
             return res.status(500).json({ message: 'Email service failed. Please check backend configuration.' });
        }

        return res.status(200).json({ message: 'Password reset link sent to your email.' });

    } catch (error) {
        console.error("FORGOT PASSWORD ERROR:", error);
        return res.status(500).json({ message: 'Server error while processing reset request.' });
    }
});

// ==========================
// 🆕 RESET PASSWORD ROUTE (Applies new password)
// ==========================
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    
    // Hash the incoming token to match the one stored in the DB
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    try {
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() } // Token must not be expired
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired password reset link.' });
        }
        
        if (newPassword.length < 6) {
             return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
        }

        // Set new password (Mongoose pre-save hook will hash it)
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        
        await user.save(); // Hashing happens here

        res.status(200).json({ message: 'Password successfully reset. You can now log in.' });

    } catch (error) {
        console.error("RESET PASSWORD ERROR:", error);
        return res.status(500).json({ message: 'Server error during password reset.' });
    }
});


export default router;