import { useEffect, useState } from 'react';
import type { Product, Category } from '../../types';
import {
    fetchProducts, deleteProduct, createProduct, updateProduct,
    bulkUpdateProducts
} from '../../features/products/productApi';
import type { BulkUpdatePayload } from '../../features/products/productApi';

import { fetchCategories } from '../../features/categories/categoryApi';
import { ClockIcon } from '@heroicons/react/24/outline';
import { getApiErrorMessage } from '../../utils/apiError';
import { useAdminSection } from '../../context/AdminSectionContext';
import ImageWithFallback from '../../components/ui/ImageWithFallback';

export default function AdminProducts() {
    const { setSection } = useAdminSection();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Individual edit modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '', price: '', stock: '', category_id: '' });
    const [imageFile, setImageFile] = useState<File | null>(null);

    // Bulk edit
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [isBulkSubmitting, setIsBulkSubmitting] = useState(false);
    const [bulkForm, setBulkForm] = useState({
        price: '', priceEnabled: false,
        stockAction: 'set' as 'set' | 'add' | 'subtract',
        stockValue: '', stockEnabled: false,
        category_id: '', categoryEnabled: false,
        is_active: 'true', statusEnabled: false,
    });

    const loadData = async () => {
        try {
            setLoading(true);
            const [productsRes, categoriesRes] = await Promise.all([
                fetchProducts(1),
                fetchCategories()
            ]);
            setProducts(productsRes.data.data);
            setCategories(categoriesRes.data);
        } catch (err: unknown) {
            setError(getApiErrorMessage(err, 'Erreur de chargement.'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleDelete = async (id: number) => {
        if (confirm('Etes-vous sur de vouloir supprimer ce produit ?')) {
            try { await deleteProduct(id); loadData(); }
            catch { alert('Erreur lors de la suppression.'); }
        }
    };

    const openModal = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                description: product.description || '',
                price: product.price.toString(),
                stock: product.stock.toString(),
                category_id: product.category_id?.toString() || ''
            });
        } else {
            setEditingProduct(null);
            setFormData({ name: '', description: '', price: '', stock: '0', category_id: '' });
        }
        setImageFile(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        setFormData({ name: '', description: '', price: '', stock: '0', category_id: '' });
        setImageFile(null);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        let finalPayload: FormData | {
            name: string;
            description: string;
            price: number;
            stock: number;
            category_id?: number;
        };
        if (imageFile) {
            const fd = new FormData();
            fd.append('name', formData.name);
            fd.append('description', formData.description);
            fd.append('price', formData.price);
            fd.append('stock', formData.stock);
            if (formData.category_id) fd.append('category_id', formData.category_id);
            fd.append('image', imageFile);
            finalPayload = fd;
        } else {
            finalPayload = {
                name: formData.name, description: formData.description,
                price: parseFloat(formData.price), stock: parseInt(formData.stock),
                category_id: formData.category_id ? parseInt(formData.category_id) : undefined
            };
        }
        try {
            if (editingProduct) await updateProduct(editingProduct.id, finalPayload);
            else await createProduct(finalPayload);
            closeModal();
            loadData();
        } catch (err: unknown) {
            setError(getApiErrorMessage(err, 'Erreur lors de la sauvegarde.'));
        } finally {
            setIsSubmitting(false);
        }
    };

    // Bulk selection helpers
    const toggleSelect = (id: number) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === products.length) setSelectedIds(new Set());
        else setSelectedIds(new Set(products.map(p => p.id)));
    };

    const handleBulkSubmit = async () => {
        setIsBulkSubmitting(true);
        try {
            const payload: BulkUpdatePayload = { product_ids: [...selectedIds] };
            if (bulkForm.priceEnabled && bulkForm.price) payload.price = parseFloat(bulkForm.price);
            if (bulkForm.stockEnabled && bulkForm.stockValue) {
                payload.stock_action = bulkForm.stockAction;
                payload.stock_value = parseInt(bulkForm.stockValue);
            }
            if (bulkForm.categoryEnabled) payload.category_id = bulkForm.category_id ? parseInt(bulkForm.category_id) : null;
            if (bulkForm.statusEnabled) payload.is_active = bulkForm.is_active === 'true';

            await bulkUpdateProducts(payload);
            setIsBulkModalOpen(false);
            setSelectedIds(new Set());
            loadData();
        } catch (err: unknown) {
            alert(getApiErrorMessage(err, 'Erreur lors de la mise a jour en masse.'));
        } finally {
            setIsBulkSubmitting(false);
        }
    };

    if (loading) return (
        <div className="p-8">
            <div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-6" />
            <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
    );

    return (
        <div>
            {/* Header */}
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white">Gestion des Produits</h1>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">Liste complete de tous les produits du catalogue.</p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 flex items-center gap-3 flex-wrap">
                    <button
                        onClick={() => setSection('product-history')}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                        type="button"
                    >
                        <ClockIcon className="w-4 h-4" />
                        Historique
                    </button>
                    {selectedIds.size > 0 && (
                        <button
                            onClick={() => setIsBulkModalOpen(true)}
                            className="px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-semibold shadow hover:bg-indigo-500 transition"
                        >
                            Editer en masse ({selectedIds.size})
                        </button>
                    )}
                    <button
                        onClick={() => openModal()}
                        type="button"
                        className="rounded-full bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-primary-500 hover:shadow-lg transition"
                    >
                        Ajouter un produit
                    </button>
                </div>
            </div>

            {error && <div className="mb-4 text-red-600 bg-red-100 p-3 rounded-xl">{error}</div>}

            {/* Table */}
            <div className="bg-white dark:bg-gray-900 shadow-sm ring-1 ring-gray-200 dark:ring-gray-800 sm:rounded-2xl overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-950">
                        <tr>
                            <th className="py-3.5 pl-4 pr-2">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.size === products.length && products.length > 0}
                                    onChange={toggleSelectAll}
                                    className="rounded border-gray-300 dark:border-gray-600"
                                />
                            </th>
                            <th scope="col" className="py-3.5 pl-2 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-3">Produit</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Prix</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Categorie</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Stock</th>
                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
                        {products.map((product) => {
                            const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
                            const isSelected = selectedIds.has(product.id);
                            return (
                                <tr key={product.id} className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition ${isSelected ? 'bg-indigo-50 dark:bg-indigo-950/20' : ''}`}>
                                    <td className="py-4 pl-4 pr-2">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => toggleSelect(product.id)}
                                            className="rounded border-gray-300 dark:border-gray-600"
                                        />
                                    </td>
                                    <td className="whitespace-nowrap py-4 pl-2 pr-3 text-sm sm:pl-3">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                <ImageWithFallback
                                                    className="h-10 w-10 border border-gray-100 dark:border-gray-800 rounded-xl object-cover bg-white"
                                                    src={product.image_url || undefined}
                                                    alt={product.name}
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <div className="font-bold text-gray-900 dark:text-white">{product.name}</div>
                                                <div className="text-gray-500 dark:text-gray-400 text-xs">SKU: {product.sku || 'N/A'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 font-semibold">
                                        {price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{product.category?.name || '-'}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-bold ring-1 ring-inset ${product.stock > 0 ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-red-50 text-red-700 ring-red-600/20'}`}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        <button onClick={() => openModal(product)} className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-4">Editer</button>
                                        <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Supprimer</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Individual Edit Modal */}
            {isModalOpen && (
                <div className="fixed z-[1000] inset-0 overflow-y-auto" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80 backdrop-blur-sm" onClick={closeModal} />
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                        <div className="relative z-10 inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl w-full">
                            <form onSubmit={handleFormSubmit}>
                                <div className="bg-white dark:bg-gray-800 px-6 pt-6 pb-4">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                        {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
                                    </h3>
                                    <div className="grid grid-cols-1 gap-y-5 sm:grid-cols-2 sm:gap-x-4">
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Nom</label>
                                            <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="block w-full rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white px-4 py-2 text-sm" />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                            <textarea rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="block w-full rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white px-4 py-2 text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Prix (EUR)</label>
                                            <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="block w-full rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white px-4 py-2 text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Stock</label>
                                            <input type="number" required value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} className="block w-full rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white px-4 py-2 text-sm" />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Image</label>
                                            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] ?? null)} className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer" />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Categorie</label>
                                            <select value={formData.category_id} onChange={e => setFormData({ ...formData, category_id: e.target.value })} className="block w-full rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white px-4 py-2 text-sm">
                                                <option value="">Selectionner...</option>
                                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-900 px-6 py-3 flex flex-row-reverse gap-3 border-t border-gray-100 dark:border-gray-800">
                                    <button type="submit" disabled={isSubmitting} className="rounded-full px-6 py-2 bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 disabled:opacity-50 transition">
                                        {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                                    </button>
                                    <button type="button" onClick={closeModal} className="rounded-full px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                        Annuler
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Edit Modal */}
            {isBulkModalOpen && (
                <div className="fixed z-[1000] inset-0 overflow-y-auto" role="dialog" aria-modal="true">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <div className="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80 backdrop-blur-sm" onClick={() => setIsBulkModalOpen(false)} />
                        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-xl z-10">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-700">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edition en Masse</h3>
                                <button onClick={() => setIsBulkModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">X</button>
                            </div>

                            <div className="px-6 py-5 space-y-5">
                                <div className="text-sm text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/30 rounded-xl px-4 py-3">
                                    Les champs laisses vides ne seront pas modifies
                                </div>

                                {/* Price */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 cursor-pointer">
                                        <input type="checkbox" checked={bulkForm.priceEnabled} onChange={e => setBulkForm({ ...bulkForm, priceEnabled: e.target.checked })} className="rounded" />
                                        Modifier le prix
                                    </label>
                                    <input
                                        type="number" step="0.01" placeholder="Nouveau prix"
                                        disabled={!bulkForm.priceEnabled}
                                        value={bulkForm.price}
                                        onChange={e => setBulkForm({ ...bulkForm, price: e.target.value })}
                                        className="block w-full rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white px-4 py-2 text-sm disabled:opacity-40"
                                    />
                                </div>

                                {/* Stock */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 cursor-pointer">
                                        <input type="checkbox" checked={bulkForm.stockEnabled} onChange={e => setBulkForm({ ...bulkForm, stockEnabled: e.target.checked })} className="rounded" />
                                        Ajuster le stock
                                    </label>
                                    <div className="flex gap-2">
                                        <select
                                            disabled={!bulkForm.stockEnabled}
                                            value={bulkForm.stockAction}
                                            onChange={e => setBulkForm({ ...bulkForm, stockAction: e.target.value as 'set' | 'add' | 'subtract' })}
                                            className="rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white px-3 py-2 text-sm disabled:opacity-40"
                                        >
                                            <option value="set">Definir a</option>
                                            <option value="add">Ajouter</option>
                                            <option value="subtract">Soustraire</option>
                                        </select>
                                        <input
                                            type="number" min="0" placeholder="0"
                                            disabled={!bulkForm.stockEnabled}
                                            value={bulkForm.stockValue}
                                            onChange={e => setBulkForm({ ...bulkForm, stockValue: e.target.value })}
                                            className="flex-1 rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white px-4 py-2 text-sm disabled:opacity-40"
                                        />
                                    </div>
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 cursor-pointer">
                                        <input type="checkbox" checked={bulkForm.categoryEnabled} onChange={e => setBulkForm({ ...bulkForm, categoryEnabled: e.target.checked })} className="rounded" />
                                        Changer la categorie
                                    </label>
                                    <select
                                        disabled={!bulkForm.categoryEnabled}
                                        value={bulkForm.category_id}
                                        onChange={e => setBulkForm({ ...bulkForm, category_id: e.target.value })}
                                        className="block w-full rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white px-4 py-2 text-sm disabled:opacity-40"
                                    >
                                        <option value="">Selectionner une categorie</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 cursor-pointer">
                                        <input type="checkbox" checked={bulkForm.statusEnabled} onChange={e => setBulkForm({ ...bulkForm, statusEnabled: e.target.checked })} className="rounded" />
                                        Modifier le statut
                                    </label>
                                    <select
                                        disabled={!bulkForm.statusEnabled}
                                        value={bulkForm.is_active}
                                        onChange={e => setBulkForm({ ...bulkForm, is_active: e.target.value })}
                                        className="block w-full rounded-xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white px-4 py-2 text-sm disabled:opacity-40"
                                    >
                                        <option value="true">Actif</option>
                                        <option value="false">Inactif</option>
                                    </select>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-700 gap-3">
                                <button onClick={() => setIsBulkModalOpen(false)} className="rounded-full px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                    Annuler
                                </button>
                                <button
                                    onClick={handleBulkSubmit}
                                    disabled={isBulkSubmitting || (!bulkForm.priceEnabled && !bulkForm.stockEnabled && !bulkForm.categoryEnabled && !bulkForm.statusEnabled)}
                                    className="rounded-full px-6 py-2 bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
                                >
                                    {isBulkSubmitting ? 'Application...' : `Appliquer aux ${selectedIds.size} produit(s) selectionne(s)`}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


