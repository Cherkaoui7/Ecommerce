export interface User {
    id: number;
    name: string;
    email: string;
    role: 'customer' | 'admin';
    email_verified_at?: string;
    created_at?: string;
    updated_at?: string;
}

export interface AuthResponse {
    success: boolean;
    data: User;
    access_token: string;
    token_type: string;
}
