import React, { useState } from 'react';
import { User } from '../types';
import { register } from '@/services/authService.ts';

interface RegisterProps {
    onLogin: (user: User) => void;
    onToggleView: () => void;
}

const Register: React.FC<RegisterProps> = ({ onLogin, onToggleView }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const newUser = await register(name, email, password);
            onLogin(newUser);
        } catch (err) {
            console.error("Registration failed:", err);
            // @ts-ignore
            setError(err.response?.data?.message || 'Registration failed. An account with this email may already exist.');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100 mb-5">Create Your Account</h2>
            {error && <p className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 p-3 rounded-md text-center mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-200 text-base"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-200 text-base"
                    />
                </div>
                <div>
                    <label htmlFor="password"className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-200 text-base"
                    />
                </div>
                 {/* Button: Reduced padding, added stylish shadow */}
                <button type="submit" className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg shadow-indigo-500/40 transition-all transform hover:-translate-y-px">
                    Create Account
                </button>
            </form>
            <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-5">
                Already have an account?{' '}
                <button onClick={onToggleView} className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline">
                    Log in
                </button>
            </p>
        </div>
    );
};

export default Register;