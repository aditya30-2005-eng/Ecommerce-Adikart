// adikart-e-commerce-platform/services/authService.ts
import api from '@/services/apiService.ts'; 
import { User } from '@/types.ts'; // <-- FINAL FIX: Alias path for User type

interface AuthResponse extends Omit<User, 'password'> {} 

export const login = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

export const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
};