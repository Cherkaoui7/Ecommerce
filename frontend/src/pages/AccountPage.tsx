import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchOrders } from '../features/orders/orderApi';
import type { Order } from '../types/order';
import { OrderItemSkeleton } from '../components/ui/SkeletonLoader';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { ADMIN_ROUTE_PREFIX } from '../constants/routes';

export default function AccountPage() {
    const localOnlyMode = !import.meta.env.VITE_API_URL;
    const { user, isAuthenticated, isLoading, logout, downloadInvoice } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(false);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, isLoading, navigate]);

    useEffect(() => {
        const loadOrders = async () => {
            if (isAuthenticated) {
                setOrdersLoading(true);
                try {
                    const res = await fetchOrders();
                    setOrders(res.data);
                } catch {
                    // Keep account page usable even if orders endpoint is temporarily unavailable.
                } finally {
                    setOrdersLoading(false);
                }
            }
        };
        loadOrders();
    }, [isAuthenticated]);

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) return null;

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
                        Mon Compte
                    </h2>
                </div>
                <div className="mt-4 flex md:ml-4 md:mt-0 gap-3">
                    {user.role === 'admin' && (
                        <button
                            onClick={() => navigate(ADMIN_ROUTE_PREFIX)}
                            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Admin Panel
                        </button>
                    )}
                    <button
                        onClick={handleLogout}
                        className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                    >
                        Se déconnecter
                    </button>
                </div>
            </div>

            <div className="overflow-hidden bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                <div className="px-4 py-6 sm:px-6">
                    <h3 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">Informations Personnelles</h3>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">
                        Détails de votre profil.
                    </p>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-700">
                    <dl className="divide-y divide-gray-100 dark:divide-gray-700">
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-900 dark:text-white">Nom complet</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">{user.name}</dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-900 dark:text-white">Adresse email</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">{user.email}</dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-900 dark:text-white">Rôle</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">
                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${user.role === 'admin' ? 'bg-purple-50 text-purple-700 ring-purple-600/20 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-400'}`}>
                                    {user.role}
                                </span>
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            {/* Historique des commandes */}
            <div className="mt-12">
                <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white mb-4">Historique de vos commandes</h3>
                {localOnlyMode && (
                    <p className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
                        Mode demo: commandes chargees depuis localStorage. Aucune commande reelle n'est transmise au serveur.
                    </p>
                )}
                {ordersLoading ? (
                    <div className="space-y-4">
                        <OrderItemSkeleton />
                        <OrderItemSkeleton />
                        <OrderItemSkeleton />
                    </div>
                ) : orders && orders.length > 0 ? (
                    <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg overflow-hidden">
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {orders.map((order) => {
                                const total = typeof order.total === 'string' ? parseFloat(order.total) : order.total;
                                return (
                                    <li key={order.id} className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                                            <div>
                                                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Commande #{order.id}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(order.created_at).toLocaleDateString('fr-FR', { 
                                                        year: 'numeric', 
                                                        month: 'long', 
                                                        day: 'numeric' 
                                                    })} à {new Date(order.created_at).toLocaleTimeString('fr-FR', { 
                                                        hour: '2-digit', 
                                                        minute: '2-digit' 
                                                    })}
                                                </p>
                                                {order.shipping_address && order.shipping_address.city && (
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        {order.shipping_address.city}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="mt-2 sm:mt-0 sm:text-right">
                                                <p className="text-lg font-bold text-gray-900 dark:text-white">{total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
                                                <span className={`mt-1 inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${order.status === 'pending' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                        order.status === 'completed' ? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-400' :
                                                            'bg-gray-50 text-gray-600 ring-gray-500/10 dark:bg-gray-900/30 dark:text-gray-400'
                                                    }`}>
                                                    {order.status === 'pending' ? 'En attente' : order.status === 'completed' ? 'Complétée' : order.status}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Download Invoice Button */}
                                        {!localOnlyMode && (
                                            <div className="mt-3 flex gap-2">
                                                <button
                                                    onClick={() => downloadInvoice(order.id).catch(() => undefined)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                                                >
                                                    <ArrowDownTrayIcon className="h-4 w-4" />
                                                    Télécharger la facture
                                                </button>
                                            </div>
                                        )}
                                        {order.items && order.items.length > 0 && (
                                            <div className="mt-4 border-t border-gray-100 dark:border-gray-700/50 pt-4">
                                                <ul className="space-y-3">
                                                    {order.items.map((item) => {
                                                        const unitPrice = typeof item.unit_price === 'string' ? parseFloat(item.unit_price) : item.unit_price;
                                                        return (
                                                            <li key={item.id} className="flex justify-between text-sm">
                                                                <div className="flex items-center text-gray-800 dark:text-gray-200">
                                                                    <span className="font-semibold mr-2">{item.quantity}x</span>
                                                                    {item.product_name_snapshot}
                                                                </div>
                                                                <div className="text-gray-600 dark:text-gray-400">
                                                                    {(unitPrice * item.quantity).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                                                </div>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg px-4 py-6 sm:px-6 text-center text-gray-500 dark:text-gray-400">
                        Vous n'avez pas encore passé de commande.
                    </div>
                )}
            </div>
        </div>
    );
}
