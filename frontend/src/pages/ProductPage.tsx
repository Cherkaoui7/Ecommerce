import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Product } from '../types';
import { fetchProduct } from '../features/products/productApi';
import { useCart } from '../context/CartContext';
import ReviewSection from '../features/reviews/ReviewSection';
import { getApiErrorMessage } from '../utils/apiError';
import ImageWithFallback from '../components/ui/ImageWithFallback';

export default function ProductPage() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    useEffect(() => {
        const loadProduct = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const response = await fetchProduct(parseInt(id, 10));
                setProduct(response.data);
            } catch (err: unknown) {
                setError(getApiErrorMessage(err, 'Erreur lors du chargement du produit.'));
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="animate-pulse flex flex-col md:flex-row gap-12">
                    <div className="w-full md:w-1/2 aspect-square bg-gray-200 dark:bg-gray-800 rounded-3xl"></div>
                    <div className="w-full md:w-1/2 space-y-6 mt-8 md:mt-0">
                        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg w-3/4"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-lg w-1/4"></div>
                        <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg w-full"></div>
                        <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-xl w-1/2"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Produit introuvable</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8">{error || "Ce produit n'existe pas ou n'est plus disponible."}</p>
                <Link to="/shop" className="text-blue-600 hover:underline font-medium">Retour à la boutique</Link>
            </div>
        );
    }

    const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
    const oldPrice = typeof product.old_price === 'string' ? parseFloat(product.old_price) : product.old_price;
    const isOutOfStock = product.stock <= 0;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
                {/* Images */}
                <div className="w-full md:w-1/2">
                    <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-100 dark:bg-dark-card border border-gray-100 dark:border-dark-border shadow-md">
                        {oldPrice && oldPrice > price && (
                            <div className="absolute top-6 left-6 z-10 bg-red-500 text-white text-sm font-bold uppercase tracking-wider py-1.5 px-4 rounded-full shadow-lg shadow-red-500/30">
                                Promo
                            </div>
                        )}
                        <ImageWithFallback
                            src={product.image_url || undefined}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Détails du produit */}
                <div className="w-full md:w-1/2 flex flex-col justify-center">
                    <nav aria-label="Breadcrumb" className="mb-6">
                        <ol className="flex items-center space-x-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                            <li><Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Accueil</Link></li>
                            <li><span aria-hidden="true">&rsaquo;</span></li>
                            <li><Link to="/shop" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Boutique</Link></li>
                            {product.category && (
                                <>
                                    <li><span aria-hidden="true">&rsaquo;</span></li>
                                    <li><span className="text-gray-900 dark:text-gray-200">{product.category.name}</span></li>
                                </>
                            )}
                        </ol>
                    </nav>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                        {product.name}
                    </h1>

                    <div className="flex items-baseline space-x-4 mb-8">
                        <span className="text-4xl font-black text-primary-600 dark:text-primary-400">
                            {price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                        </span>
                        {oldPrice && oldPrice > price && (
                            <span className="text-xl font-bold text-gray-400 line-through">
                                {oldPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                            </span>
                        )}
                    </div>

                    <div className="prose prose-sm sm:prose-base dark:prose-invert text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
                        <p>{product.description}</p>
                    </div>

                    <div className="mb-8 flex items-center">
                        <div className={`flex items-center px-4 py-2 rounded-full font-medium text-sm ${isOutOfStock ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'}`}>
                            {isOutOfStock ? (
                                <>
                                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span>Rupture de stock</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    <span>En stock ({product.stock} disponibles)</span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-auto">
                        <div className="flex items-center border-[1.5px] border-gray-200 dark:border-dark-border rounded-xl bg-white dark:bg-dark-card h-14 max-w-[140px] shadow-sm">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-12 h-full flex items-center justify-center text-gray-500 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-l-xl transition"
                                disabled={isOutOfStock}
                            >
                                -
                            </button>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-full text-center bg-transparent font-bold border-none focus:ring-0 p-0 text-gray-900 dark:text-white"
                                min="1"
                                max={product.stock}
                                disabled={isOutOfStock}
                            />
                            <button
                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                className="w-12 h-full flex items-center justify-center text-gray-500 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-r-xl transition"
                                disabled={isOutOfStock}
                            >
                                +
                            </button>
                        </div>

                        <button
                            onClick={() => addToCart(product, quantity)}
                            disabled={isOutOfStock}
                            className={`flex-1 h-14 rounded-xl font-bold tracking-wide transition-all duration-300 flex items-center justify-center
                                ${isOutOfStock
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500 border border-gray-200 dark:border-gray-700'
                                    : 'btn-primary'
                                }
                            `}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 mr-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                            {isOutOfStock ? 'Indisponible' : 'Ajouter au panier'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Section Avis Clients */}
            <ReviewSection productId={product.id} />
        </div>
    );
}
