// adikart-e-commerce-platform/components/AdminDashboard.tsx
import React, { useState } from 'react';
import { Product } from '../types';
import { addProduct } from '@/services/productService.ts';

interface AdminDashboardProps {
    products: Product[];
    onProductAdded: (product: Product) => void;
    onProductEdit: (product: Product) => void;
    onProductDelete: (productId: number) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, onProductAdded, onProductEdit, onProductDelete }) => {
    const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
        name: '',
        description: '',
        price: undefined as unknown as number,
        imageUrl: '',
        category: '',
        stock: undefined as unknown as number
    });

    const [isAdding, setIsAdding] = useState(false);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (!editingProduct) {
            setNewProduct(prev => ({
                ...prev,
                [name]: name === 'price' || name === 'stock'
                    ? (value === '' ? undefined : Number(value))
                    : value
            }));
        } else {
            setEditingProduct(prev => prev ? ({
                ...prev,
                [name]: name === 'price' || name === 'stock'
                    ? (value === '' ? undefined : Number(value))
                    : value
            }) : null);
        }
    };

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAdding(true);
        setAlertMessage(null);

        if (!newProduct.name || !newProduct.price || !newProduct.imageUrl) {
            setAlertMessage('Please fill out all required fields (Name, Price, Image URL).');
            setIsAdding(false);
            return;
        }

        try {
            const addedProductWithId = await addProduct(newProduct);
            onProductAdded(addedProductWithId);
            setAlertMessage(`✅ Product "${addedProductWithId.name}" added successfully!`);
            setNewProduct({
                name: '',
                description: '',
                price: undefined as unknown as number,
                imageUrl: '',
                category: '',
                stock: undefined as unknown as number
            });
        } catch (error) {
            console.error("Failed to add product:", error);
            setAlertMessage('❌ Error adding product. Please check your server.');
        } finally {
            setIsAdding(false);
        }
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProduct) {
            onProductEdit(editingProduct);
            setEditingProduct(null);
            setAlertMessage(`✅ Product "${editingProduct.name}" updated successfully!`);
        }
    };

    const handleDelete = (productId: number) => {
        onProductDelete(productId);
    };

    return (
        <div className="space-y-10">
            <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-6 tracking-tight">
                Admin Dashboard
            </h1>

            {alertMessage && (
                <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-700 dark:text-green-100 shadow-md">
                    {alertMessage}
                </div>
            )}

            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl transition-all duration-300">
                <h2 className="text-2xl font-semibold mb-5 border-b pb-3 text-slate-800 dark:text-slate-200">
                    {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Product'}
                </h2>

                <form onSubmit={editingProduct ? handleEditSubmit : handleAddSubmit} className="space-y-5">
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={editingProduct ? editingProduct.name : newProduct.name}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 shadow-sm p-3 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Description</label>
                        <textarea
                            name="description"
                            id="description"
                            value={editingProduct ? editingProduct.description : newProduct.description}
                            onChange={handleInputChange}
                            rows={3}
                            required
                            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 shadow-sm p-3 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 transition"
                        />
                    </div>

                    {/* Price & Stock */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Price</label>
                            <input
                                type="number"
                                name="price"
                                id="price"
                                value={editingProduct ? (editingProduct.price ?? '') : (newProduct.price ?? '')}
                                onChange={handleInputChange}
                                required
                                min="0.01"
                                step="0.01"
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 shadow-sm p-3 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 transition"
                            />
                        </div>
                        <div>
                            <label htmlFor="stock" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Stock</label>
                            <input
                                type="number"
                                name="stock"
                                id="stock"
                                value={editingProduct ? (editingProduct.stock ?? '') : (newProduct.stock ?? '')}
                                onChange={handleInputChange}
                                required
                                min="0"
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 shadow-sm p-3 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 transition"
                            />
                        </div>
                    </div>

                    {/* Image URL & Category */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Image URL</label>
                            <input
                                type="url"
                                name="imageUrl"
                                id="imageUrl"
                                value={editingProduct ? editingProduct.imageUrl : newProduct.imageUrl}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 shadow-sm p-3 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 transition"
                            />
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Category</label>
                            <select
                                name="category"
                                id="category"
                                value={editingProduct ? editingProduct.category : newProduct.category}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 shadow-sm p-3 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 transition"
                            >
                                <option value="">-- Select Category --</option>
                                <option value="Electronics">Electronics ⚡</option>
                                <option value="Clothing">Clothing 👕</option>
                                <option value="Footwear">Footwear 👟</option>
                                <option value="Accessories">Accessories 🎒</option>
                                <option value="Home Appliances">Home Appliances 🏠</option>
                                <option value="Beauty & Personal Care">Beauty & Personal Care 💅</option>
                                <option value="Books">Books 📚</option>
                            </select>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="pt-6 flex justify-end gap-3">
                        {editingProduct && (
                            <button
                                type="button"
                                onClick={() => setEditingProduct(null)}
                                className="px-5 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition"
                            >
                                Cancel Edit
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={isAdding}
                            className={`px-6 py-2.5 rounded-lg text-sm font-medium text-white shadow-md transition-all 
                                ${isAdding
                                    ? 'bg-indigo-400 dark:bg-indigo-600 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400'
                                }`}
                        >
                            {isAdding ? 'Processing...' : (editingProduct ? 'Save Changes' : 'Add Product')}
                        </button>
                    </div>
                </form>
            </div>

            {/* Product List */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl">
                <h2 className="text-2xl font-semibold mb-5 border-b pb-3 text-slate-800 dark:text-slate-200">
                    Current Products ({products.length})
                </h2>
                <div className="overflow-x-auto rounded-lg">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-100 dark:bg-slate-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">Stock</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                            {products.map((product) => (
                                <tr
                                    key={product.id}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">
                                        {String(product.id).substring(0, 8)}...
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">{product.name}</td>
                                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">${product.price.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">{product.stock}</td>
                                    <td className="px-6 py-4 text-right text-sm space-x-3">
                                        <button
                                            onClick={() => setEditingProduct(product)}
                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold transition"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 font-semibold transition"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
