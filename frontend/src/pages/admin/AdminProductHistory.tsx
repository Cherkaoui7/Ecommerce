import React, { useEffect, useState } from 'react';

import { fetchProductHistory } from '../../features/products/productApi';
import { ArrowLeftIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { useAdminSection } from '../../context/AdminSectionContext';

interface HistoryEntry {
    id: number;
    product_id: number | null;
    user_id: number | null;
    action: 'created' | 'updated' | 'deleted' | 'bulk_update';
    old_values: Record<string, unknown> | null;
    new_values: Record<string, unknown> | null;
    description: string | null;
    created_at: string;
    product: { id: number; name: string; image_url: string | null } | null;
    user: { id: number; name: string } | null;
}

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
    created: { label: 'Créé', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    updated: { label: 'Modifié', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    deleted: { label: 'Supprimé', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
    bulk_update: { label: 'Masse', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleString('fr-FR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

function ChangeSummary({ entry }: { entry: HistoryEntry }) {
    if (!entry.old_values || !entry.new_values) return <span className="text-gray-400 text-xs">—</span>;

    const changed: string[] = [];
    const fields = ['price', 'stock', 'is_active', 'category_id', 'name'];
    for (const f of fields) {
        if (entry.old_values[f] !== entry.new_values[f]) {
            const labels: Record<string, string> = {
                price: 'Prix', stock: 'Stock', is_active: 'Statut',
                category_id: 'Catégorie', name: 'Nom',
            };
            changed.push(labels[f] || f);
        }
    }

    return (
        <span className="text-xs text-gray-600 dark:text-gray-400">
            {changed.length > 0 ? changed.join(', ') : entry.description || '—'}
        </span>
    );
}

export default function AdminProductHistory() {
    const { setSection } = useAdminSection();
    const [entries, setEntries] = useState<HistoryEntry[]>([]);
    const [stats, setStats] = useState<{ total: number; today: number; this_week: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const res = await fetchProductHistory();
                setEntries(res.data?.data ?? []);
                setStats(res.stats ?? null);
            } catch {
                setError('Impossible de charger l\'historique.');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const exportCSV = () => {
        const headers = ['Date', 'Produit', 'Action', 'Utilisateur', 'Description'];
        const rows = entries.map(e => [
            formatDate(e.created_at),
            e.product?.name ?? `#${e.product_id}`,
            ACTION_LABELS[e.action]?.label ?? e.action,
            e.user?.name ?? 'Système',
            e.description ?? '',
        ]);
        const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `historique-produits-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const statCards = [
        { label: 'Total modifications', value: stats?.total ?? 0, color: 'text-gray-900 dark:text-white' },
        { label: 'Aujourd\'hui', value: stats?.today ?? 0, color: 'text-orange-500' },
        { label: 'Cette semaine', value: stats?.this_week ?? 0, color: 'text-green-500' },
    ];

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                        <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Historique des Modifications</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Suivi complet de toutes les modifications de produits</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setSection('products')}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                        type="button"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        Produits
                    </button>
                    <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition">
                        <DocumentArrowDownIcon className="w-4 h-4" />
                        Exporter CSV
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {statCards.map(card => (
                    <div key={card.label} className="bg-white dark:bg-gray-900 rounded-2xl p-5 ring-1 ring-gray-200 dark:ring-gray-800 flex items-center gap-4">
                        <div className="flex-1">
                            <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
                            <p className={`text-3xl font-black mt-1 ${card.color}`}>{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-900 shadow-sm ring-1 ring-gray-200 dark:ring-gray-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Journal des activités</h2>
                </div>

                {loading ? (
                    <div className="animate-pulse p-8 space-y-4">
                        {[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-gray-100 dark:bg-gray-800 rounded-xl" />)}
                    </div>
                ) : error ? (
                    <div className="p-8 text-center text-red-500">{error}</div>
                ) : entries.length === 0 ? (
                    <div className="p-16 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600">
                        <svg className="w-16 h-16 mb-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="font-semibold text-lg">Aucune modification enregistrée</p>
                        <p className="text-sm mt-1">Les activités apparaîtront ici</p>
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
                        <thead className="bg-gray-50 dark:bg-gray-950">
                            <tr>
                                {['Date & Heure', 'Produit', 'Action', 'Utilisateur', 'Description', 'Détails'].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {entries.map(entry => {
                                const actionMeta = ACTION_LABELS[entry.action] ?? { label: entry.action, color: 'bg-gray-100 text-gray-700' };
                                return (
                                    <React.Fragment key={entry.id}>
                                        <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                            <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{formatDate(entry.created_at)}</td>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                                                {entry.product ? entry.product.name : <span className="text-gray-400 italic">Produit supprimé</span>}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${actionMeta.color}`}>
                                                    {actionMeta.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{entry.user?.name ?? <span className="italic text-gray-400">Système</span>}</td>
                                            <td className="px-4 py-3"><ChangeSummary entry={entry} /></td>
                                            <td className="px-4 py-3">
                                                {(entry.old_values || entry.new_values) && (
                                                    <button
                                                        onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                                                        className="text-xs text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 font-medium underline transition"
                                                    >
                                                        {expandedId === entry.id ? 'Masquer' : 'Voir'}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                        {expandedId === entry.id && (
                                            <tr key={`${entry.id}-detail`} className="bg-blue-50 dark:bg-blue-950/20">
                                                <td colSpan={6} className="px-6 py-4">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        {entry.old_values && (
                                                            <div>
                                                                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">Avant</p>
                                                                <pre className="text-xs bg-white dark:bg-gray-900 p-3 rounded-xl overflow-auto ring-1 ring-gray-200 dark:ring-gray-700 max-h-40 text-gray-700 dark:text-gray-300">
                                                                    {JSON.stringify(entry.old_values, null, 2)}
                                                                </pre>
                                                            </div>
                                                        )}
                                                        {entry.new_values && (
                                                            <div>
                                                                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">Après</p>
                                                                <pre className="text-xs bg-white dark:bg-gray-900 p-3 rounded-xl overflow-auto ring-1 ring-gray-200 dark:ring-gray-700 max-h-40 text-gray-700 dark:text-gray-300">
                                                                    {JSON.stringify(entry.new_values, null, 2)}
                                                                </pre>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
