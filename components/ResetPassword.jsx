// adikart-e-commerce-platform/components/ResetPassword.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/auth'; 

const ResetPassword = ({ onToggleView, resetToken }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [statusMessage, setStatusMessage] = useState('Please enter your new password.');
    const [isResetting, setIsResetting] = useState(false);

    useEffect(() => {
        if (!resetToken) {
            setError('Missing password reset link. Please restart the process.');
            setStatusMessage('Error: Link is invalid.');
        }
    }, [resetToken]);

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!resetToken) {
            setError('Reset link is missing. Please check your URL or restart the process.');
            return;
        }

        if (newPassword.length < 6) {
            setError('New password must be at least 6 characters long.');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsResetting(true);

        try {
            // Call the final backend endpoint to verify token and set new password
            const response = await axios.post(`${API_BASE_URL}/reset-password`, { 
                token: resetToken, 
                newPassword: newPassword 
            });
            
            setStatusMessage(response.data.message); 
            
            // Redirect back to login after a short delay
            setTimeout(() => onToggleView('login'), 2000);

        } catch (err) {
            console.error("Password Reset Failed:", err);
            // @ts-ignore
            setError(err.response?.data?.message || 'Password reset failed. Link may be expired.');
        } finally {
            setIsResetting(false);
        }
    };
    
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
            {/* Display status messages clearly to the user */}
            {error && <p className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 p-3 rounded-md text-center mb-4 w-full">{error}</p>}
            {statusMessage && <p className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 p-3 rounded-md text-center mb-4 w-full">{statusMessage}</p>}
            
            <form onSubmit={handlePasswordReset} className="space-y-4 w-full">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3 text-center">Set New Password</h3>
                <p className="text-sm text-center text-slate-600 dark:text-slate-400">Link is valid for 15 minutes.</p>

                <InputField 
                    label="New Password" 
                    id="new-password" 
                    type="password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    required 
                    placeholder="Use a strong, unique password" 
                />
                 <InputField 
                    label="Confirm New Password" 
                    id="confirm-password" 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                    placeholder="Repeat password" 
                />
                <button type="submit" disabled={isResetting} className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-all disabled:bg-red-400">
                    {isResetting ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>

            <button onClick={() => onToggleView('login')} className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 mt-4 hover:underline">
                &larr; Back to Login
            </button>
        </div>
    );
};

export default ResetPassword;