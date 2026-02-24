import { useState, useEffect } from 'react';
import httpClient from '../../api/httpClient';
import type { Product } from '../../types';

interface DashboardData {
    overview: {
        total_sales: number;
        total_orders: number;
        total_customers: number;
        active_products: number;
        new_customers: number;
        recent_orders: number;
        recent_revenue: number;
        conversion_rate: number;
        average_order_value: number;
        low_stock_alerts: number;
    };
    top_products: Array<{
        product: Pick<Product, 'id' | 'name'> | null;
        total_sold: number;
    }>;
    daily_revenue: Array<{
        date: string;
        revenue: number;
        orders: number;
    }>;
}

export default function AdminDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setError(null);
            const response = await httpClient.get('/analytics/dashboard');
            if (response.data.success) {
                setData(response.data.data);
            }
        } catch {
            setError('Impossible de charger les donnees du dashboard.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    const stats = data?.overview;

    return (
        <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Tableau de Bord</h1>

            {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white dark:bg-gray-900 overflow-hidden shadow sm:rounded-2xl border border-gray-100 dark:border-gray-800">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Ventes Totales</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                            €{stats?.total_sales.toLocaleString() || 0}
                        </dd>
                        <p className="mt-1 text-xs text-gray-500">
                            Moyenne: €{stats?.average_order_value.toFixed(2) || 0}/commande
                        </p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 overflow-hidden shadow sm:rounded-2xl border border-gray-100 dark:border-gray-800">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Commandes</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                            {stats?.total_orders || 0}
                        </dd>
                        <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                            {stats?.recent_orders || 0} ce mois
                        </p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 overflow-hidden shadow sm:rounded-2xl border border-gray-100 dark:border-gray-800">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Clients</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                            {stats?.total_customers || 0}
                        </dd>
                        <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                            +{stats?.new_customers || 0} ce mois
                        </p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 overflow-hidden shadow sm:rounded-2xl border border-gray-100 dark:border-gray-800">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Produits Actifs</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                            {stats?.active_products || 0}
                        </dd>
                        {stats && stats.low_stock_alerts > 0 && (
                            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                ⚠️ {stats.low_stock_alerts} en stock bas
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Secondary Stats */}
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="bg-white dark:bg-gray-900 overflow-hidden shadow sm:rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Revenus (30j)</h3>
                    <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                        €{stats?.recent_revenue.toLocaleString() || 0}
                    </p>
                </div>
                <div className="bg-white dark:bg-gray-900 overflow-hidden shadow sm:rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Taux de Conversion</h3>
                    <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                        {stats?.conversion_rate || 0}%
                    </p>
                </div>
                <div className="bg-white dark:bg-gray-900 overflow-hidden shadow sm:rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Panier Moyen</h3>
                    <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                        €{stats?.average_order_value.toFixed(2) || 0}
                    </p>
                </div>
            </div>

            {/* Top Products */}
            {data && data.top_products.length > 0 && (
                <div className="mt-8 bg-white dark:bg-gray-900 overflow-hidden shadow sm:rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Produits les Plus Vendus</h2>
                    <div className="space-y-3">
                        {data.top_products.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">#{index + 1}</span>
                                    <span className="text-sm text-gray-900 dark:text-white">{item.product?.name || 'N/A'}</span>
                                </div>
                                <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                                    {item.total_sold} vendus
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-8 bg-white dark:bg-gray-900 overflow-hidden shadow sm:rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Bienvenue dans l'espace d'administration</h2>
                <p className="text-gray-500 dark:text-gray-400">
                    Utilisez la barre de navigation à gauche pour gérer le catalogue de produits, les catégories, suivre les commandes et gérer les utilisateurs de la plateforme.
                </p>
            </div>
        </div>
    );
}
