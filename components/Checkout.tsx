// adikart-e-commerce-platform/components/Checkout.tsx
import React, { useState } from 'react';
import { CartItem, User } from '../types';
import axios from 'axios'; // Import axios for backend calls

interface CheckoutProps {
  cartItems: CartItem[];
  onSuccessfulPayment: () => void;
  onNavigateBack: () => void;
  user: User;
}

// NOTE: Ensure your API base URL is correct
const API_BASE_URL = 'http://localhost:5000/api'; 

const Checkout: React.FC<CheckoutProps> = ({ cartItems, onSuccessfulPayment, onNavigateBack, user }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
  });
  const [isProcessing, setIsProcessing] = useState(false);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const subtotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.08; 
  const shipping = 100.00; 
  const total = subtotal + tax + shipping;
  const amountInPaise = Math.round(total * 100); // Amount in the smallest currency unit (paise for INR)

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
        alert("Please fill out all shipping details.");
        return;
    }

    setIsProcessing(true);

    try {
        // STEP 1: Call Backend to create Order ID securely
        const orderResponse = await axios.post(`${API_BASE_URL}/payment/order`, {
            amount: amountInPaise,
            currency: 'INR',
        });
        
        const { id: order_id, amount, currency, key_id } = orderResponse.data;

        const options = {
            key: key_id, // Use the public key returned from the backend
            amount: amount, 
            currency: currency, 
            name: "Adikart",
            description: "Order Payment",
            order_id: order_id, // Pass the secured Order ID
            handler: async (response: any) => {
                // STEP 3: Call Backend to verify payment signature
                try {
                    await axios.post(`${API_BASE_URL}/payment/verify`, response);
                    onSuccessfulPayment(); // Success only after verification
                } catch (verifyError) {
                    alert("Payment failed verification. Contact support.");
                    console.error("Verification Error:", verifyError);
                }
            },
            prefill: {
                name: formData.name,
                email: formData.email,
                contact: formData.phone,
            },
            theme: {
                color: "#4F46E5",
            },
        };

        // STEP 2: Open Razorpay modal
        const rzp = new window.Razorpay(options);
        rzp.open();

    } catch (error) {
        console.error("Payment initiation failed:", error);
        // @ts-ignore
        alert(error.response?.data?.message || "Failed to initiate payment. Check server connection/Razorpay setup.");
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-6 border-b dark:border-slate-700 pb-4">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Checkout</h2>
        <button onClick={onNavigateBack} className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">&larr; Back to Cart</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Shipping Form */}
        <div>
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4">Shipping Information</h3>
          <form onSubmit={handlePayment} className="space-y-4">
            <InputField label="Full Name" name="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" required />
            <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="example@email.com" required />
            <InputField label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="1234567890" required />
            <InputField label="Address" name="address" value={formData.address} onChange={handleInputChange} placeholder="123 Main St" required />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="City" name="city" value={formData.city} onChange={handleInputChange} placeholder="New Delhi" required />
                <InputField label="State / Province" name="state" value={formData.state} onChange={handleInputChange} placeholder="Delhi" required />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="ZIP / Postal Code" name="zip" value={formData.zip} onChange={handleInputChange} placeholder="110001" required />
                <InputField label="Country" name="country" value={formData.country} onChange={handleInputChange} placeholder="India" required />
            </div>
             <button type="submit" disabled={isProcessing} className="w-full mt-6 bg-green-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-px disabled:opacity-50">
                {isProcessing ? 'Processing...' : `Pay ₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </button>
          </form>
        </div>

        {/* Order Summary (remains the same) */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4">Your Order</h3>
          <div className="space-y-3">
            {cartItems.map(item => (
              <div key={item.product.id} className="flex justify-between items-center text-sm">
                <span className="text-slate-600 dark:text-slate-300">{item.product.name} x{item.quantity}</span>
                <span className="font-medium text-slate-800 dark:text-slate-100">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
          <div className="border-t dark:border-slate-700 my-4"></div>
          <div className="space-y-2 text-slate-600 dark:text-slate-400">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span>Taxes (8%)</span><span>₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>₹{shipping.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
            <div className="border-t dark:border-slate-700 my-2"></div>
            <div className="flex justify-between font-bold text-slate-800 dark:text-slate-100 text-lg">
              <span>Total</span>
              <span>₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label htmlFor={props.id || props.name} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>
        <input {...props} className="w-full px-4 py-3 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500" />
    </div>
);

export default Checkout;