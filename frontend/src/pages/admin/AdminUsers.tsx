import { useEffect, useState } from 'react';
import httpClient from '../../api/httpClient';
import { getApiErrorMessage } from '../../utils/apiError';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'customer';
    created_at: string;
}

interface UsersResponse {
    success?: boolean;
    data?: User[];
}

interface UserResponse {
    success?: boolean;
    data?: User;
}

interface UpdateUserPayload {
    name: string;
    email: string;
    role: 'admin' | 'customer';
    password?: string;
    password_confirmation?: string;
}

const userInitials = (name: string) => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('') || 'U';
};

export default function AdminUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<{
        name: string;
        email: string;
        role: 'admin' | 'customer';
        password: string;
        password_confirmation: string;
    }>({
        name: '',
        email: '',
        role: 'customer',
        password: '',
        password_confirmation: '',
    });

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await httpClient.get<UsersResponse | User[]>('/users');
            const payload = Array.isArray(res.data) ? res.data : (res.data.data ?? []);
            setUsers(payload);
        } catch (err: unknown) {
            setError(getApiErrorMessage(err, 'Erreur de chargement des utilisateurs.'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadUsers();
    }, []);

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            password: '',
            password_confirmation: '',
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        setFormData({
            name: '',
            email: '',
            role: 'customer',
            password: '',
            password_confirmation: '',
        });
    };

    const handleSave = async () => {
        if (!editingUser) {
            return;
        }

        if (formData.password || formData.password_confirmation) {
            if (formData.password.length < 8) {
                setError('Le mot de passe doit contenir au moins 8 caracteres.');
                return;
            }

            if (formData.password !== formData.password_confirmation) {
                setError('Le mot de passe et sa confirmation ne correspondent pas.');
                return;
            }
        }

        setError(null);
        setIsSaving(true);

        try {
            const payload: UpdateUserPayload = {
                name: formData.name,
                email: formData.email,
                role: formData.role,
            };

            if (formData.password || formData.password_confirmation) {
                payload.password = formData.password;
                payload.password_confirmation = formData.password_confirmation;
            }

            const res = await httpClient.put<UserResponse>(`/users/${editingUser.id}`, payload);
            const updatedUser = res.data?.data ?? { ...editingUser, ...formData };

            setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? { ...u, ...updatedUser } : u)));
            closeModal();
        } catch (err: unknown) {
            setError(getApiErrorMessage(err, 'Impossible de mettre a jour cet utilisateur.'));
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-6"></div>
                <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white">Gestion des Utilisateurs</h1>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">Liste des clients et administrateurs.</p>
                </div>
            </div>

            {error && <div className="mb-4 text-red-600 bg-red-100 p-3 rounded-xl">{error}</div>}

            <div className="bg-white dark:bg-gray-900 shadow-sm ring-1 ring-gray-200 dark:ring-gray-800 sm:rounded-2xl overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-950">
                        <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">Nom</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Email</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Role</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Date d'inscription</th>
                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                                            {userInitials(user.name)}
                                        </div>
                                        <div className="ml-4 font-bold">{user.name}</div>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                    <span
                                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                            user.role === 'admin'
                                                ? 'bg-purple-50 text-purple-700 ring-purple-600/20'
                                                : 'bg-gray-50 text-gray-700 ring-gray-600/20'
                                        }`}
                                    >
                                        {user.role}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(user.created_at).toLocaleDateString('fr-FR')}
                                </td>
                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                    <button
                                        onClick={() => openEditModal(user)}
                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        Editer
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {users.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">Aucun utilisateur trouve.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && editingUser && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4" role="dialog" aria-modal="true">
                    <div className="absolute inset-0 bg-gray-500/75 dark:bg-gray-900/80 backdrop-blur-sm" onClick={closeModal}></div>
                    <div className="relative z-10 w-full max-w-xl rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Modifier l'utilisateur</h3>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">X</button>
                        </div>

                        <div className="px-6 py-5 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nom</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                    className="w-full rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white px-4 py-2 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                                    className="w-full rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white px-4 py-2 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value as 'admin' | 'customer' }))}
                                    className="w-full rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white px-4 py-2 text-sm"
                                >
                                    <option value="customer">customer</option>
                                    <option value="admin">admin</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Nouveau mot de passe (optionnel)
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                                    className="w-full rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white px-4 py-2 text-sm"
                                    placeholder="Laisser vide pour ne pas changer"
                                    autoComplete="new-password"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Confirmation mot de passe
                                </label>
                                <input
                                    type="password"
                                    value={formData.password_confirmation}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, password_confirmation: e.target.value }))}
                                    className="w-full rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white px-4 py-2 text-sm"
                                    placeholder="Retaper le nouveau mot de passe"
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center justify-end gap-3">
                            <button
                                onClick={closeModal}
                                className="rounded-full px-6 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="rounded-full px-6 py-2 bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
