import { useState, useEffect } from 'react';
import type { Product } from '../types';
import { fetchProducts } from '../features/products/productApi';
import ProductCard from '../components/ui/ProductCard';

export default function PromosPage() {
    const [promos, setPromos] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPromos = async () => {
            try {
                // Fetch page 1 products and filter locally for simplicity, 
                // assuming promos have an old_price > price
                const response = await fetchProducts(1);
                const allProducts = response.data.data;
                const promotionalProducts = allProducts.filter(p => {
                    if (!p.old_price) return false;
                    const price = typeof p.price === 'string' ? parseFloat(p.price) : p.price;
                    const oldPrice = typeof p.old_price === 'string' ? parseFloat(p.old_price) : p.old_price;
                    return oldPrice > price;
                });
                setPromos(promotionalProducts);
            } catch (error) {
                console.error("Failed to fetch promos", error);
            } finally {
                setLoading(false);
            }
        };
        loadPromos();
    }, []);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-10 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-500 dark:from-red-400 dark:to-orange-400">
                        Bons Plans & Promos
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Découvrez nos meilleures offres du moment. Des réductions exceptionnelles sur une sélection d'articles.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : promos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {promos.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 glass-card rounded-2xl">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Aucune promotion en cours</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Revenez bientôt pour découvrir de nouvelles offres exceptionnelles !
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
