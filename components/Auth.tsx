// adikart-e-commerce-platform/components/Auth.tsx
import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword'; // <-- NEW IMPORT
import { User } from '../types';

interface AuthProps {
    onLogin: (user: User) => void;
}

type AuthView = 'login' | 'register' | 'forgot_password'; // <-- UPDATED TYPE

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
    const [currentView, setCurrentView] = useState<AuthView>('login');

    const toggleView = (view: AuthView) => setCurrentView(view);

    const renderContent = () => {
        switch (currentView) {
            case 'login':
                // Pass onForgotPassword prop
                return <Login onLogin={onLogin} onToggleView={() => toggleView('register')} onForgotPassword={() => toggleView('forgot_password')} />;
            case 'register':
                return <Register onLogin={onLogin} onToggleView={() => toggleView('login')} />;
            case 'forgot_password':
                return <ForgotPassword onToggleView={toggleView} onLogin={onLogin} />;
            default:
                return <Login onLogin={onLogin} onToggleView={() => toggleView('register')} onForgotPassword={() => toggleView('forgot_password')} />;
        }
    }


    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col justify-center items-center p-4 font-['Inter',_sans-serif]">
            <div className="flex items-center space-x-3 mb-6">
                 {/* Stylish Gradient Logo */}
                 <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg shadow-xl">
                    <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                </div>
                <span className="text-slate-800 dark:text-slate-100 text-3xl font-extrabold tracking-tight">Adikart</span>
            </div>

            <div className="w-full max-w-sm">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl shadow-indigo-500/30 dark:shadow-purple-900/50 p-6 border border-slate-200 dark:border-slate-700 min-h-[400px]">
                    {renderContent()}
                </div>
            </div>

             <footer className="text-center py-3 mt-4 text-slate-500 dark:text-slate-400 text-xs">
                <p>&copy; 2024 Adikart. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Auth;