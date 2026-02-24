import { useEffect, useMemo, useState } from 'react';
import type { Product, Category } from '../types';
import { fetchProducts } from '../features/products/productApi';
import ProductCard from '../components/ui/ProductCard';
import httpClient from '../api/httpClient';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { ProductCardSkeleton } from '../components/ui/SkeletonLoader';
import { getApiErrorMessage } from '../utils/apiError';

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    fetchProducts(1, selectedCategory),
                    httpClient.get<{ success: boolean; data: Category[] }>('/categories')
                ]);
                setProducts(productsRes.data.data);
                setCategories(categoriesRes.data.data);
            } catch (err: unknown) {
                setError(getApiErrorMessage(err, 'Erreur lors du chargement des données.'));
            } finally {
                setLoading(false);
            }
        };
        void loadData();
    }, [selectedCategory]);

    const filteredProducts = useMemo(() => {
        if (!searchQuery.trim()) return products;
        const lowerQuery = searchQuery.toLowerCase();
        return products.filter((product) =>
            product.name.toLowerCase().includes(lowerQuery) ||
            product.description?.toLowerCase().includes(lowerQuery)
        );
    }, [products, searchQuery]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-8">
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border sticky top-24">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recherche</h3>
                        <div className="relative mb-8">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-shadow"
                                placeholder="Rechercher un produit..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Catégories</h3>
                        <ul className="space-y-2">
                            <li>
                                <button
                                    onClick={() => setSelectedCategory(undefined)}
                                    className={`text-left w-full px-3 py-2 rounded-lg transition-all duration-200 ${selectedCategory === undefined ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 font-semibold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'}`}
                                >
                                    Toutes les catégories
                                </button>
                            </li>
                            {categories.map((category) => (
                                <li key={category.id}>
                                    <button
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`text-left w-full px-3 py-2 rounded-lg transition-all duration-200 ${selectedCategory === category.id ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 font-semibold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'}`}
                                    >
                                        {category.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                <div className="flex-grow">
                    <div className="flex justify-between items-end mb-8 border-b border-gray-200 dark:border-dark-border pb-4">
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                                {selectedCategory
                                    ? categories.find((c) => c.id === selectedCategory)?.name || 'Boutique'
                                    : 'Tous les produits'}
                            </h2>
                            {searchQuery && (
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Résultats pour "{searchQuery}"
                                </p>
                            )}
                        </div>
                        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                            {filteredProducts.length} résultat{filteredProducts.length > 1 ? 's' : ''}
                        </span>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <ProductCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-800">
                            <p className="font-medium">{error}</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-20 bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm">
                            <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Aucun produit trouvé</h3>
                            <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                                Essayez de modifier vos mots-clés ou de retirer les filtres pour voir plus de résultats.
                            </p>
                            {(searchQuery || selectedCategory) && (
                                <button
                                    onClick={() => { setSearchQuery(''); setSelectedCategory(undefined); }}
                                    className="mt-6 text-primary-600 dark:text-primary-400 font-semibold hover:underline"
                                >
                                    Effacer tous les filtres
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
