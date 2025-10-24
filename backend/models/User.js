// backend/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto'; 

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  
  resetPasswordToken: { type: String }, 
  resetPasswordExpire: { type: Date }, 
  
}, { timestamps: true });

// CRITICAL FIX: Ensure password hashing runs robustly
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    
    if (!this.password) {
        return next(new Error('Password field cannot be empty.'));
    }
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// CRITICAL FIX: Ensure comparePassword method is correct
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.getResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
};

const User = mongoose.model('User', userSchema);
export default User;