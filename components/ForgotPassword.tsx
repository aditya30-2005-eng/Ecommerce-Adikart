// adikart-e-commerce-platform/components/ForgotPassword.tsx
import React, { useState } from 'react';
import { User } from '../types';
import axios from 'axios'; // Placeholder/Simulated import

interface ForgotPasswordProps {
    onToggleView: (view: 'login' | 'register') => void;
    onLogin: (user: User) => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onToggleView, onLogin }) => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
    const [error, setError] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    
    // Step 1: Simulate Email Check
    const handleEmailCheck = async (e) => {
        e.preventDefault();
        setError('');
        setIsSending(true);

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            if (!email.includes('@') || !email.includes('.')) {
                setError('Please enter a valid email address.');
                return;
            }

            // Assume Backend sent the email (Simulated Code: 123456)
            // NOTE: In a live app, this message comes from the backend API.
            setStatusMessage(`OTP sent to ${email}. (Simulated code: 123456)`);
            setStep('otp');
            
        } catch (err) {
            setError('Failed to request OTP. Check server logs.');
        } finally {
            setIsSending(false);
        }
    };
    
    // Step 2: Simulate OTP verification
    const handleOtpCheck = (e) => {
        e.preventDefault();
        setError('');
        
        // Simple simulation: correct OTP is "123456"
        if (otp === '123456') {
            setError('');
            setStatusMessage('OTP verified. Please set your new password.');
            setStep('reset');
        } else {
            setError('Invalid OTP. Please try again. (Hint: Use 123456)');
        }
    };

    // Step 3: Final Password Reset (Simulated)
    const handlePasswordReset = async (e) => {
        e.preventDefault();
        
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        setError('');
        setIsSending(true);

        // NOTE: In a real MERN app, this calls the /reset-password API
        
        setStatusMessage('Password successfully reset! Redirecting to login...');
        
        setTimeout(() => onToggleView('login'), 1500);
        setIsSending(false);
    };

    const renderStep = () => {
        switch (step) {
            case 'email':
                return (
                    <form onSubmit={handleEmailCheck} className="space-y-4">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">Reset Password</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Enter your email to receive a password reset code.</p>
                        <InputField label="Email Address" id="reset-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="user@example.com" />
                        <button type="submit" disabled={isSending} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all disabled:bg-indigo-400">
                            {isSending ? 'Sending...' : 'Send Reset Code'}
                        </button>
                    </form>
                );
            case 'otp':
                return (
                    <form onSubmit={handleOtpCheck} className="space-y-4"> 
                         <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">Verify OTP</h3>
                         <p className="text-sm text-slate-600 dark:text-slate-400">Enter the code sent to your email. Use 123456 to verify.</p>
                        <InputField label="6-Digit Code" id="reset-otp" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required placeholder="123456" maxLength={6} />
                        <button type="submit" disabled={isSending} className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-all disabled:bg-green-400">
                            Verify Code
                        </button>
                    </form>
                );
            case 'reset':
                return (
                    <form onSubmit={handlePasswordReset} className="space-y-4">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">Set New Password</h3>
                        <InputField label="New Password" id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required placeholder="Min. 6 characters" />
                        <button type="submit" disabled={isSending} className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-all disabled:bg-red-400">
                            {isSending ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                );
            default:
                return null;
        }
    };
    
    // Utility component for consistent input style
    const InputField = ({ label, ...props }) => (
        <div>
            <label htmlFor={props.id || props.name} className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
            <input
                {...props}
                className="mt-1 block w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-200 text-base"
            />
        </div>
    );


    return (
        <div className="flex flex-col items-center">
            {error && <p className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 p-3 rounded-md text-center mb-4 w-full">{error}</p>}
            {statusMessage && <p className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 p-3 rounded-md text-center mb-4 w-full">{statusMessage}</p>}
            
            {renderStep()}

            <button onClick={() => onToggleView('login')} className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 mt-4 hover:underline">
                &larr; Back to Login
            </button>
        </div>
    );
};

export default ForgotPassword;