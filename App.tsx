// adikart-e-commerce-platform/App.tsx
import React, { useState, useEffect } from 'react'; 
import { Product, CartItem, User } from './types';
import { getProducts, deleteProduct, editProduct } from '@/services/productService.ts'; 
import Header from './components/Header';
import ProductList from './components/ProductList';
import ShoppingCart from './components/ShoppingCart';
import Checkout from './components/Checkout';
import AdminDashboard from './components/AdminDashboard';
import Auth from './components/Auth';

export type View = 'products' | 'cart' | 'checkout' | 'admin';
export type Theme = 'light' | 'dark';

const App: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [currentView, setCurrentView] = useState<View>('products');
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true); 
    const [authChecked, setAuthChecked] = useState(false);
    
    // Theme Initialization
    const [theme, setTheme] = useState<Theme>(() => {
        try {
            const root = document.documentElement;
            return root.classList.contains('dark') ? 'dark' : 'light';
        } catch (e) {
            return 'light';
        }
    });

    // 1. Initial Auth Check
    useEffect(() => {
        let userLoaded = false; 
        const sessionData = sessionStorage.getItem('adikart-user-session');

        try {
            if (sessionData) {
                const loadedUser = JSON.parse(sessionData);
                setUser(loadedUser);
                userLoaded = true;
            }
        } catch (error) {
            console.error("Failed to parse user from sessionStorage", error);
        } finally {
            setAuthChecked(true); 
            
            if (!userLoaded) { 
                setLoading(false); 
            }
        }
    }, []);

    // 2. Load User-Specific Cart
    useEffect(() => {
        if (user) {
            try {
                const savedCart = localStorage.getItem(`adikart-cart-${user.id}`);
                setCartItems(savedCart ? JSON.parse(savedCart) : []);
            } catch (error) {
                console.error("Failed to load user-specific cart:", error);
                setCartItems([]);
            }
        }
    }, [user]);

    // 3. Persist User-Specific Cart
    useEffect(() => {
        if (user && authChecked) { 
            localStorage.setItem(`adikart-cart-${user.id}`, JSON.stringify(cartItems));
        }
    }, [cartItems, user, authChecked]);


    // 4. Products Fetch
    useEffect(() => {
        if (user && products.length === 0) {
            const fetchProducts = async () => {
                try {
                    const fetchedProducts = await getProducts();
                    setProducts(fetchedProducts);
                } catch (error) {
                    console.error("Failed to fetch products:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchProducts();
        }
    }, [user]); 

    
    // 5. Theme Application Logic
    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('adikart-theme', theme);
    }, [theme]);
    
    // Theme Toggle Function (used by Header)
    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const handleLogin = (loggedInUser: User) => {
        sessionStorage.setItem('adikart-user-session', JSON.stringify(loggedInUser));
        setUser(loggedInUser);
        setCurrentView('products');
        setCartItems([]);
        setProducts([]); 
        setLoading(true); 
    };

    const handleLogout = () => {
        sessionStorage.removeItem('adikart-user-session');
        setUser(null);
        setCartItems([]);
        setProducts([]); 
        setCurrentView('products');
        setLoading(false); 
    };

    const handleNavigate = (view: View) => {
        setCurrentView(view);
    };

    const handleAddToCart = (productToAdd: Product) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.product.id === productToAdd.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.product.id === productToAdd.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevItems, { product: productToAdd, quantity: 1 }];
        });
    };

    const handleUpdateQuantity = (productId: number, newQuantity: number) => {
        if (newQuantity < 1) {
            handleRemoveFromCart(productId);
            return;
        }
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.product.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const handleRemoveFromCart = (productId: number) => {
        setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
    };

    const handleClearCart = () => {
        setCartItems([]);
    };

    const handleSuccessfulPayment = () => {
        alert('Payment successful! Your order has been placed.');
        setCartItems([]);
        setCurrentView('products');
    };

    const handleAddProduct = (newProduct: Product) => {
        setProducts(prevProducts => [...prevProducts, newProduct]);
    };

    const handleDeleteProduct = async (productId: number) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await deleteProduct(productId); 
            setProducts(prev => prev.filter(p => p.id !== productId));
            alert('Product deleted successfully!');
        } catch (error) {
            alert('Error deleting product from database. Check server logs.');
        }
    };

    const handleEditProduct = async (updatedProduct: Product) => {
        try {
            await editProduct(updatedProduct); 
            const result = updatedProduct; 
            setProducts(prev => prev.map(p => p.id === result.id ? result : p));
            alert('Product updated successfully!');
        } catch (error) {
            alert('Error updating product.');
        }
    };
    
    // Show a loader until authentication status is checked
    if (!authChecked) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-900">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 dark:border-indigo-400"></div>
            </div>
        );
    }

    if (!user) {
        return <Auth onLogin={handleLogin} />;
    }

    const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    const renderContent = () => {
        if (loading) { 
            return (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 dark:border-indigo-400"></div>
                </div>
            );
        }

        switch (currentView) {
            case 'products':
                return <ProductList products={products} onAddToCart={handleAddToCart} />;
            case 'cart':
                return <ShoppingCart
                    cartItems={cartItems}
                    updateQuantity={handleUpdateQuantity}
                    removeFromCart={handleRemoveFromCart}
                    clearCart={handleClearCart}
                    onNavigate={handleNavigate}
                />;
            case 'checkout':
                return <Checkout
                    cartItems={cartItems}
                    onSuccessfulPayment={handleSuccessfulPayment}
                    onNavigateBack={() => handleNavigate('cart')}
                    user={user}
                />;
            case 'admin':
                if (user.role === 'admin') {
                    return <AdminDashboard 
                                onProductAdded={handleAddProduct}
                                onProductDelete={handleDeleteProduct}
                                onProductEdit={handleEditProduct}
                                products={products} 
                            />;
                }
                setCurrentView('products');
                return <ProductList products={products} onAddToCart={handleAddToCart} />;
            default:
                return <ProductList products={products} onAddToCart={handleAddProduct} />;
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen font-['Inter',_sans-serif] text-slate-800 dark:text-slate-200">
            <Header
                cartItemCount={cartItemCount}
                onNavigate={handleNavigate}
                currentView={currentView}
                user={user}
                onLogout={handleLogout}
                theme={theme}
                toggleTheme={toggleTheme}
            />
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                {renderContent()}
            </main>
        </div>
    );
};

export default App;