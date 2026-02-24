import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useComparison } from '../../context/ComparisonContext';
import { HeartIcon as HeartOutline, Squares2X2Icon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import ImageWithFallback from './ImageWithFallback';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { addToComparison, isInComparison } = useComparison();

    const inWishlist = isInWishlist(product.id);
    const inComparison = isInComparison(product.id);

    // Safe price parsing
    const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
    const oldPrice = typeof product.old_price === 'string' ? parseFloat(product.old_price) : product.old_price;

    return (
        <div className="group relative bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border flex flex-col h-full card-hover">
            {/* Badge promotion & Wishlist */}
            <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start pointer-events-none">
                {oldPrice && oldPrice > price ? (
                    <div className="bg-red-500 text-white text-xs font-bold uppercase tracking-wider py-1.5 px-3 rounded-full shadow-lg shadow-red-500/30">
                        Promo
                    </div>
                ) : <div></div>}

                <div className="pointer-events-auto flex gap-2">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            addToComparison(product);
                        }}
                        className={`p-2 rounded-full shadow-md transition-bg-color backdrop-blur-md ${inComparison ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-500' : 'bg-white/80 dark:bg-gray-800/80 text-gray-400 hover:text-blue-500 hover:bg-white'} transition-all duration-300 hover:scale-110 active:scale-95`}
                        title="Comparer ce produit"
                    >
                        <Squares2X2Icon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            if (inWishlist) {
                                removeFromWishlist(product.id);
                            } else {
                                addToWishlist(product);
                            }
                        }}
                        className={`p-2 rounded-full shadow-md transition-bg-color backdrop-blur-md ${inWishlist ? 'bg-red-50 dark:bg-red-900/30 text-red-500 hover:bg-red-100' : 'bg-white/80 dark:bg-gray-800/80 text-gray-400 hover:text-red-500 hover:bg-white'} transition-all duration-300 hover:scale-110 active:scale-95`}
                        title={inWishlist ? "Retirer des favoris" : "Ajouter aux favoris"}
                    >
                        {inWishlist ? (
                            <HeartSolid className="h-5 w-5" />
                        ) : (
                            <HeartOutline className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </div>

            {/* Image placeholder */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-t-2xl">
                {!product.image_url && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                        <svg className="w-24 h-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
                <ImageWithFallback
                    src={product.image_url || undefined}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-out"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        {product.category && (
                            <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 mb-1 tracking-wide uppercase">
                                {product.category.name}
                            </p>
                        )}
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            <Link to={`/products/${product.id}`}>
                                <span aria-hidden="true" className="absolute inset-0" />
                                {product.name}
                            </Link>
                        </h3>
                    </div>
                </div>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-grow">
                    {product.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-dark-border">
                    <div className="flex items-baseline space-x-2">
                        <span className="text-xl font-black text-gray-900 dark:text-white">
                            {price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                        </span>
                        {oldPrice && oldPrice > price && (
                            <span className="text-sm font-medium text-gray-400 line-through">
                                {oldPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            addToCart(product, 1);
                        }}
                        className="z-20 relative p-2.5 text-primary-600 bg-primary-50 hover:bg-primary-600 hover:text-white dark:text-primary-400 dark:bg-primary-900/30 dark:hover:bg-primary-500 dark:hover:text-white rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/30 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 active:scale-95"
                        title="Ajouter au panier"
                    >
                        <span className="sr-only">Ajouter au panier</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
