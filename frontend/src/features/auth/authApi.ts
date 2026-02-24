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

interface LocalStoredUser extends User {
    password: string;
}

const LOCAL_USERS_KEY = 'local_auth_users';
const LOCAL_ACTIVE_USER_KEY = 'local_auth_active_user_id';
const LOCAL_TOKEN_PREFIX = 'local-demo-token-';
const LOCAL_MODE = !import.meta.env.VITE_API_URL;

const getNowIso = () => new Date().toISOString();

const getSeedUsers = (): LocalStoredUser[] => {
    const now = getNowIso();
    return [
        {
            id: 1,
            name: 'Admin User',
            email: 'admin@ecommerce.com',
            role: 'admin',
            password: 'admin123',
            created_at: now,
            updated_at: now,
        },
        {
            id: 2,
            name: 'John Customer',
            email: 'john@example.com',
            role: 'customer',
            password: 'CustomerDemo!2026',
            created_at: now,
            updated_at: now,
        },
    ];
};

const readLocalUsers = (): LocalStoredUser[] => {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    if (!raw) {
        const seeded = getSeedUsers();
        localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(seeded));
        return seeded;
    }
    try {
        const users = JSON.parse(raw) as LocalStoredUser[];
        if (!Array.isArray(users) || users.length === 0) {
            const seeded = getSeedUsers();
            localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(seeded));
            return seeded;
        }
        return users;
    } catch {
        const seeded = getSeedUsers();
        localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(seeded));
        return seeded;
    }
};

const writeLocalUsers = (users: LocalStoredUser[]) => {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
};

const toPublicUser = (user: LocalStoredUser): User => {
    const publicUser = { ...user };
    delete publicUser.password;
    return publicUser;
};

const setLocalSession = (userId: number) => {
    localStorage.setItem('auth_token', `${LOCAL_TOKEN_PREFIX}${userId}`);
    localStorage.setItem(LOCAL_ACTIVE_USER_KEY, String(userId));
};

const localAuthResponse = (user: User): AuthResponse => ({
    success: true,
    data: user,
    access_token: localStorage.getItem('auth_token') || `${LOCAL_TOKEN_PREFIX}${user.id}`,
    token_type: 'Bearer',
});

export const login = async (credentials: LoginCredentials) => {
    if (LOCAL_MODE) {
        const users = readLocalUsers();
        const matched = users.find(
            (u) =>
                u.email.toLowerCase() === credentials.email.trim().toLowerCase() &&
                u.password === credentials.password
        );
        if (!matched) {
            throw new Error('Identifiants invalides.');
        }
        setLocalSession(matched.id);
        return localAuthResponse(toPublicUser(matched));
    }

    const response = await httpClient.post<AuthResponse>('/auth/login', credentials);
    if (response.data.access_token) {
        localStorage.setItem('auth_token', response.data.access_token);
    }
    return response.data;
};

export const register = async (userData: RegisterPayload) => {
    if (LOCAL_MODE) {
        const users = readLocalUsers();
        const email = userData.email.trim().toLowerCase();
        const exists = users.some((u) => u.email.toLowerCase() === email);
        if (exists) {
            throw new Error('Cet email est deja utilise.');
        }

        const now = getNowIso();
        const newUser: LocalStoredUser = {
            id: users.reduce((maxId, user) => Math.max(maxId, user.id), 0) + 1,
            name: userData.name.trim(),
            email,
            role: 'customer',
            password: userData.password,
            created_at: now,
            updated_at: now,
        };
        const nextUsers = [...users, newUser];
        writeLocalUsers(nextUsers);
        setLocalSession(newUser.id);
        return localAuthResponse(toPublicUser(newUser));
    }

    const response = await httpClient.post<AuthResponse>('/auth/register', userData);
    if (response.data.access_token) {
        localStorage.setItem('auth_token', response.data.access_token);
    }
    return response.data;
};

export const logout = async () => {
    if (LOCAL_MODE) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem(LOCAL_ACTIVE_USER_KEY);
        return;
    }

    try {
        await httpClient.post('/auth/logout');
    } finally {
        localStorage.removeItem('auth_token');
    }
};

export const fetchUser = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('No token found');

    if (LOCAL_MODE) {
        const activeUserId = Number(localStorage.getItem(LOCAL_ACTIVE_USER_KEY) || 0);
        const users = readLocalUsers();
        const user =
            users.find((u) => u.id === activeUserId) ||
            users.find((u) => token === `${LOCAL_TOKEN_PREFIX}${u.id}`);
        if (!user) {
            throw new Error('Session invalide');
        }
        return { success: true, data: toPublicUser(user) };
    }

    const response = await httpClient.get<{ success: boolean; data: User }>('/auth/user');
    return response.data;
};
