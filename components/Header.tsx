// Header height reduced from h-20 to h-16
import React from 'react';
import ShoppingCartIcon from './icons/ShoppingCartIcon';
import UserIcon from './icons/UserIcon';
import { View, Theme } from '../App';
import { User } from '../types';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';

interface HeaderProps {
  cartItemCount: number;
  onNavigate: (view: View) => void;
  currentView: View;
  user: User | null;
  onLogout: () => void;
  theme: Theme;
  toggleTheme: () => void;
}

const Logo: React.FC = () => (
    <div className="flex items-center space-x-3 flex-shrink-0">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg shadow-xl">
          <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        </div>
        <span className="text-slate-900 dark:text-slate-100 text-xl font-black tracking-tight">Adikart</span>
    </div>
);

const Header: React.FC<HeaderProps> = ({ cartItemCount, onNavigate, currentView, user, onLogout, theme, toggleTheme }) => {
  
  const NavLink: React.FC<{ view: View; children: React.ReactNode }> = ({ view, children }) => (
    <button
      onClick={() => onNavigate(view)}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out relative ${
        currentView === view
          ? 'text-indigo-600 dark:text-indigo-400'
          : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
      }`}
    >
      {children}
      {currentView === view && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-0.5 bg-indigo-500 dark:bg-indigo-400 rounded-full"></span>}
    </button>
  );
  
  const handleToggleTheme = () => {
    const root = document.documentElement;
    const isCurrentlyDark = root.classList.contains('dark');
    
    if (isCurrentlyDark) {
      root.classList.remove('dark');
      localStorage.setItem('adikart-theme', 'light');
    } else {
      root.classList.add('dark');
      localStorage.setItem('adikart-theme', 'dark');
    }
    toggleTheme();
  };


  return (
    <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button onClick={() => onNavigate('products')}>
              <Logo />
            </button>
            <div className="hidden md:block">
              <div className="ml-8 flex items-baseline space-x-2">
                <NavLink view="products">Products</NavLink>
                {user?.role === 'admin' && <NavLink view="admin">Admin Dashboard</NavLink>}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-slate-700 dark:text-slate-300 text-sm hidden sm:block font-semibold">Welcome, {user?.name}!</span>
            
            <button onClick={handleToggleTheme} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all">
                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>

            <button
              onClick={() => onNavigate('cart')}
              className="relative p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
              aria-label="Shopping cart"
            >
              <ShoppingCartIcon />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white ring-2 ring-white dark:ring-slate-900">
                  {cartItemCount}
                </span>
              )}
            </button>
            <div className="relative">
                 <button onClick={onLogout} 
                 className="flex items-center space-x-2 px-3 py-1.5 rounded-xl text-sm font-bold text-white 
                 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 
                 shadow-md shadow-red-500/30 hover:shadow-lg transition-all transform hover:-translate-y-px">
                    <UserIcon />
                    <span>Logout</span>
                 </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;