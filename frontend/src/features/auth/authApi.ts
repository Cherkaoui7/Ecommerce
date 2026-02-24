import httpClient from '../../api/httpClient';
import type { AuthResponse, User } from '../../types/auth';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export const login = async (credentials: LoginCredentials) => {
    const response = await httpClient.post<AuthResponse>('/auth/login', credentials);
    if (response.data.access_token) {
        localStorage.setItem('auth_token', response.data.access_token);
    }
    return response.data;
};

export const register = async (userData: RegisterPayload) => {
    const response = await httpClient.post<AuthResponse>('/auth/register', userData);
    if (response.data.access_token) {
        localStorage.setItem('auth_token', response.data.access_token);
    }
    return response.data;
};

export const logout = async () => {
    try {
        await httpClient.post('/auth/logout');
    } finally {
        localStorage.removeItem('auth_token');
    }
};

export const fetchUser = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('No token found');

    const response = await httpClient.get<{ success: boolean; data: User }>('/auth/user');
    return response.data;
};
