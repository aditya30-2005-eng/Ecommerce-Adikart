// adikart-e-commerce-platform/components/ForgotPassword.tsx
import React, { useState } from 'react';
import api from '@/services/apiService.ts'; // <-- CRITICAL FIX: Use configured API service

interface ForgotPasswordProps {
    onToggleView: (view: 'login' | 'register') => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onToggleView }) => {
    const [email, setEmail] = useState('');
    // Step changed from 'otp' and 'reset' to 'success' as the link handles the reset
    const [step, setStep] = useState<'email' | 'success'>('email'); 
    const [error, setError] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    
    // Step 1: Handle sending the reset link via API
    const handleEmailCheck = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setStatusMessage('');
        setIsSending(true);

        if (!email.includes('@') || !email.includes('.')) {
            setError('Please enter a valid email address.');
            setIsSending(false);
            return;
        }

        try {
            // Call the new backend endpoint to send the reset link
            const response = await api.post('/auth/forgot-password', { email });
            
            // Backend sends a generic message to prevent exposing valid emails
            setStatusMessage(response.data.message || 'Password reset link sent to your email.');
            setStep('success');
            
        } catch (err) {
            console.error("Forgot Password failed:", err);
            // @ts-ignore
            // Backend should return a message, but fall back if it fails
            setError(err.response?.data?.message || 'Failed to request password reset. Check server status.');
        } finally {
            setIsSending(false);
        }
    };
    
    // Render logic updated to display success message instead of multi-step form
    const renderStep = () => {
        if (step === 'success') {
            return (
                <div className="text-center space-y-4">
                     <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">Check Your Email</h3>
                     <p className="text-sm text-slate-600 dark:text-slate-400">
                         We have sent a password reset link to <span className="font-semibold text-indigo-600 dark:text-indigo-400">{email}</span>.
                     </p>
                     <p className="text-xs text-slate-500 dark:text-slate-500">
                         The link is valid for 15 minutes. If you don't see it, check your spam folder.
                     </p>
                </div>
            );
        }

        return (
            <form onSubmit={handleEmailCheck} className="space-y-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">Reset Password</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Enter your email to receive a password reset link.</p>
                <InputField label="Email Address" id="reset-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="user@example.com" />
                <button type="submit" disabled={isSending} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all disabled:bg-indigo-400">
                    {isSending ? 'Sending...' : 'Send Reset Link'}
                </button>
            </form>
        );
    };
    
    // Utility component for consistent input style
    const InputField = ({ label, ...props }: any) => (
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