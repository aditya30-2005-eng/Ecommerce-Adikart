// adikart-e-commerce-platform/services/authService.ts

// FIX 1: Use the project root alias (@/) for the types file.
// (Assuming types.ts is in the project root: adikart-e-commerce-platform/types.ts)
import { User } from '@/types.ts'; 
import api from '@/services/apiService.ts'; 

// FIX 2: Corrected the type syntax to use 'interface' or 'type ='
interface AuthResponse extends Omit<User, 'password'> {} 

export const login = async (email: string, password: string): Promise<AuthResponse> => {
    // Calls POST http://localhost:5000/api/auth/login
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

export const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
    // Calls POST http://localhost:5000/api/auth/register
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
};