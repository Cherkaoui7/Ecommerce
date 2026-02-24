import { Link } from 'react-router-dom';
import { useComparison } from '../context/ComparisonContext';
import { useCart } from '../context/CartContext';
import { XMarkIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import type { Category } from '../types';
import ImageWithFallback from '../components/ui/ImageWithFallback';

type ComparisonField = 'price' | 'old_price' | 'stock' | 'category' | 'sku';

interface ComparisonAttribute {
    key: ComparisonField;
    label: string;
    format: (value: unknown) => string;
}

const formatMoney = (value: string | number) => {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    return numericValue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
};

export default function ComparisonPage() {
    const { items, removeFromComparison, clearComparison } = useComparison();
    const { addToCart } = useCart();

    if (items.length === 0) {
        return (
            <>
                <SEO
                    title="Comparateur de produits"
                    description="Comparez jusqu'à 4 produits pour trouver celui qui vous convient le mieux"
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center animate-fade-in">
                    <div className="bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm p-12">
                        <svg className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Aucun produit à comparer</h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
                            Ajoutez des produits au comparateur pour voir leurs caractéristiques côte à côte.
                        </p>
                        <Link to="/shop" className="btn-primary inline-flex items-center">
                            Parcourir la boutique
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    const attributes: ComparisonAttribute[] = [
        {
            key: 'price',
            label: 'Prix',
            format: (value) => formatMoney(value as string | number),
        },
        {
            key: 'old_price',
            label: 'Prix barré',
            format: (value) => (value ? formatMoney(value as string | number) : '-'),
        },
        {
            key: 'stock',
            label: 'Stock disponible',
            format: (value) => {
                const stock = typeof value === 'number' ? value : 0;
                return stock > 0 ? `${stock} unités` : 'Rupture';
            },
        },
        {
            key: 'category',
            label: 'Catégorie',
            format: (value) => (value as Category | undefined)?.name || '-',
        },
        {
            key: 'sku',
            label: 'Référence',
            format: (value) => (typeof value === 'string' && value.trim().length > 0 ? value : '-'),
        },
    ];

    return (
        <>
            <SEO
                title="Comparaison de produits"
                description={`Comparez ${items.length} produits: ${items.map((p) => p.name).join(', ')}`}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
                            Comparateur de produits
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            {items.length} produit{items.length > 1 ? 's' : ''} en comparaison
                        </p>
                    </div>
                    <button
                        onClick={clearComparison}
                        className="btn-secondary text-sm"
                    >
                        Tout effacer
                    </button>
                </div>

                <div className="bg-white dark:bg-dark-card rounded-3xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="p-6 text-left text-sm font-semibold text-gray-900 dark:text-white sticky left-0 bg-white dark:bg-dark-card z-10">
                                        Caractéristique
                                    </th>
                                    {items.map((product) => (
                                        <th key={product.id} className="p-6 min-w-[280px] relative">
                                            <button
                                                onClick={() => removeFromComparison(product.id)}
                                                className="absolute top-4 right-4 p-1.5 rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                                                title="Retirer de la comparaison"
                                            >
                                                <XMarkIcon className="h-4 w-4" />
                                            </button>
                                            <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden mb-4">
                                                <ImageWithFallback
                                                    src={product.image_url || undefined}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-2 line-clamp-2">
                                                {product.name}
                                            </h3>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {attributes.map((attr) => (
                                    <tr key={attr.key} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="p-6 text-sm font-medium text-gray-700 dark:text-gray-300 sticky left-0 bg-white dark:bg-dark-card z-10">
                                            {attr.label}
                                        </td>
                                        {items.map((product) => (
                                            <td key={product.id} className="p-6 text-sm text-gray-900 dark:text-gray-100">
                                                {attr.format(product[attr.key])}
                                            </td>
                                        ))}
                                    </tr>
                                ))}

                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="p-6 text-sm font-medium text-gray-700 dark:text-gray-300 sticky left-0 bg-white dark:bg-dark-card z-10">
                                        Description
                                    </td>
                                    {items.map((product) => (
                                        <td key={product.id} className="p-6 text-sm text-gray-600 dark:text-gray-400">
                                            <p className="line-clamp-3">{product.description || '-'}</p>
                                        </td>
                                    ))}
                                </tr>

                                <tr className="bg-gray-50 dark:bg-gray-800/50">
                                    <td className="p-6 text-sm font-medium text-gray-700 dark:text-gray-300 sticky left-0 bg-gray-50 dark:bg-gray-800/50 z-10">
                                        Actions
                                    </td>
                                    {items.map((product) => {
                                        const isOutOfStock = product.stock <= 0;

                                        return (
                                            <td key={product.id} className="p-6">
                                                <div className="flex flex-col gap-2">
                                                    <button
                                                        onClick={() => addToCart(product, 1)}
                                                        disabled={isOutOfStock}
                                                        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                                                            isOutOfStock
                                                                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                                                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                                                        }`}
                                                    >
                                                        <ShoppingCartIcon className="h-4 w-4" />
                                                        {isOutOfStock ? 'Indisponible' : 'Ajouter au panier'}
                                                    </button>
                                                    <Link
                                                        to={`/products/${product.id}`}
                                                        className="w-full text-center px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                                                    >
                                                        Voir détails
                                                    </Link>
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <Link to="/shop" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                        ← Continuer mes achats
                    </Link>
                </div>
            </div>
        </>
    );
}
