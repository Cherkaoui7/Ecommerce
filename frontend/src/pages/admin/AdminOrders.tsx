import { useEffect, useState } from 'react';
import httpClient from '../../api/httpClient';
import { fetchOrders } from '../../features/orders/orderApi';
import type { Order } from '../../types/order';
import { getApiErrorMessage } from '../../utils/apiError';

const statusOptions = ['pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled'] as const;

const formatCurrency = (value: string | number) => {
    const numeric = typeof value === 'string' ? parseFloat(value) : value;
    return Number.isFinite(numeric)
        ? numeric.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
        : '0,00 EUR';
};

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [statusDraft, setStatusDraft] = useState<string>('pending');
    const [isUpdating, setIsUpdating] = useState(false);

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetchOrders();
            setOrders(res.data);
        } catch (err: unknown) {
            setError(getApiErrorMessage(err, 'Erreur de chargement des commandes.'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadOrders();
    }, []);

    const openOrderModal = (order: Order) => {
        setSelectedOrder(order);
        setStatusDraft(order.status);
        setIsModalOpen(true);
    };

    const closeOrderModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
        setStatusDraft('pending');
    };

    const handleStatusUpdate = async () => {
        if (!selectedOrder) {
            return;
        }

        setIsUpdating(true);
        setError(null);

        try {
            const res = await httpClient.put(`/orders/${selectedOrder.id}`, { status: statusDraft });
            const updatedOrder: Order = res.data?.data ?? { ...selectedOrder, status: statusDraft };

            setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? { ...o, ...updatedOrder } : o)));
            setSelectedOrder((prev) => (prev ? { ...prev, ...updatedOrder } : null));
        } catch (err: unknown) {
            setError(getApiErrorMessage(err, 'Impossible de mettre a jour le statut de la commande.'));
        } finally {
            setIsUpdating(false);
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
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white">Gestion des Commandes</h1>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">Liste complete de toutes les commandes.</p>
                </div>
            </div>

            {error && <div className="mb-4 text-red-600 bg-red-100 p-3 rounded-xl">{error}</div>}

            <div className="bg-white dark:bg-gray-900 shadow-sm ring-1 ring-gray-200 dark:ring-gray-800 sm:rounded-2xl overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-950">
                        <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">ID</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Client</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Date & Heure</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Ville</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Total</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Statut</th>
                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">#{order.id}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                    {order.user?.name || `User_${order.user_id}`}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                    <div>{new Date(order.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                                    <div className="text-xs text-gray-400">{new Date(order.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                    {order.shipping_address?.city || '-'}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 font-bold dark:text-white">{formatCurrency(order.total)}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                        order.status === 'completed'
                                            ? 'bg-green-50 text-green-700 ring-green-600/20'
                                            : order.status === 'pending'
                                                ? 'bg-yellow-50 text-yellow-700 ring-yellow-600/20'
                                                : 'bg-gray-50 text-gray-700 ring-gray-600/20'
                                    }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                    <button
                                        onClick={() => openOrderModal(order)}
                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        Voir
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {orders.length === 0 && (
                            <tr>
                                <td colSpan={7} className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">Aucune commande trouvee.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4" role="dialog" aria-modal="true">
                    <div className="absolute inset-0 bg-gray-500/75 dark:bg-gray-900/80 backdrop-blur-sm" onClick={closeOrderModal}></div>
                    <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Commande #{selectedOrder.id}</h3>
                            <button onClick={closeOrderModal} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">X</button>
                        </div>

                        <div className="px-6 py-5 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400">Client</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{selectedOrder.user?.name || `User_${selectedOrder.user_id}`}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400">Total</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(selectedOrder.total)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400">Date</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{new Date(selectedOrder.created_at).toLocaleString('fr-FR')}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400">Ville</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{selectedOrder.shipping_address?.city || '-'}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Articles</p>
                                <div className="max-h-52 overflow-auto rounded-xl border border-gray-100 dark:border-gray-700">
                                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                                            {selectedOrder.items.map((item) => (
                                                <li key={item.id} className="px-4 py-3 flex items-center justify-between text-sm">
                                                    <span className="text-gray-800 dark:text-gray-200">{item.quantity} x {item.product_name_snapshot}</span>
                                                    <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(item.line_total)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">Aucun article charge.</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Statut de la commande</label>
                                <select
                                    value={statusDraft}
                                    onChange={(e) => setStatusDraft(e.target.value)}
                                    className="w-full rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white px-4 py-2 text-sm"
                                >
                                    {statusOptions.map((status) => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center justify-end gap-3">
                            <button onClick={closeOrderModal} className="rounded-full px-6 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300">Fermer</button>
                            <button
                                onClick={handleStatusUpdate}
                                disabled={isUpdating}
                                className="rounded-full px-6 py-2 bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isUpdating ? 'Mise a jour...' : 'Enregistrer le statut'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
