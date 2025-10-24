// adikart-e-commerce-platform/services/productService.ts
import { Product } from '@/types.ts'; 
import api from '@/services/apiService.ts'; 

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get('/products'); 
    return response.data.map((p: any) => ({ ...p, id: p._id || p.id })); 
  } catch (error) {
    console.error("API Error fetching products:", error);
    return []; 
  }
};

export const addProduct = async (newProduct: Omit<Product, 'id'>): Promise<Product> => {
    try {
        const response = await api.post('/products', newProduct); 
        const createdProduct = response.data;
        return { ...createdProduct, id: createdProduct._id }; 
    } catch (error) {
        console.error("API Error adding product:", error);
        throw new Error('Failed to add product to database.');
    }
};

// Ensure deleteProduct is correctly exported
export const deleteProduct = async (productId: number): Promise<void> => {
    try {
        await api.delete(`/products/${String(productId)}`);
    } catch (error) {
        console.error("API Error deleting product:", error);
        throw new Error('Failed to delete product from database.');
    }
};

// CRITICAL FIX: Ensure editProduct is correctly exported
export const editProduct = async (product: Product): Promise<Product> => {
    try {
        // Await the PUT request to the backend
        await api.put(`/products/${String(product.id)}`, product);
        return product; // Return the product after successful update
    } catch (error) {
        console.error("API Error editing product:", error);
        throw new Error('Failed to edit product.');
    }
};