import React from 'react';
import { CartItem } from '../types';
import { View } from '../App';

interface ShoppingCartProps {
  cartItems: CartItem[];
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  onNavigate: (view: View) => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ cartItems, updateQuantity, removeFromCart, clearCart, onNavigate }) => {
  const subtotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  if (cartItems.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 p-12 rounded-2xl shadow-md text-center border border-slate-200 dark:border-slate-700">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">Your Cart is Empty</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto">Looks like you haven't added anything to your cart yet. Time to start shopping!</p>
        <button onClick={() => onNavigate('products')} className="mt-8 bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg">
            Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Shopping Cart</h2>
      
      <div className="lg:grid lg:grid-cols-3 lg:gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(item => (
            <div key={item.product.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-shadow hover:shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img src={item.product.imageUrl} alt={item.product.name} className="w-24 h-24 object-cover rounded-lg border dark:border-slate-600" />
                <div>
                  <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">{item.product.name}</h3>
                  <p className="text-slate-600 dark:text-slate-400">₹{item.product.price.toLocaleString('en-IN')}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <button 
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)} 
                    className="px-3 py-1 font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-l-lg focus:outline-none disabled:opacity-50"
                    disabled={item.quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-center font-medium text-slate-800 dark:text-slate-100 w-12" aria-live="polite">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)} 
                    className="px-3 py-1 font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-r-lg focus:outline-none"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button onClick={() => removeFromCart(item.product.id)} className="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors" title="Remove item">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
            <div className="mt-4 flex justify-end">
                <button onClick={clearCart} className="text-sm text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:underline transition-colors">Clear Cart</button>
            </div>
        </div>

        <div className="lg:col-span-1 mt-8 lg:mt-0 sticky top-28">
            <div className="bg-white dark:bg-slate-800 shadow-md rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold mb-4 dark:text-slate-100">Order Summary</h3>
                <div className="space-y-3 text-slate-600 dark:text-slate-400">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Tax (8%)</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-900 dark:text-slate-100 text-xl mt-4 pt-4 border-t dark:border-slate-700">
                        <span>Total</span>
                        <span>₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                </div>
                <button 
                onClick={() => onNavigate('checkout')}
                className="w-full mt-6 bg-green-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-px"
                >
                Proceed to Checkout
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;