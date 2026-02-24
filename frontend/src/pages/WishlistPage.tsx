import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ui/ProductCard';
import { HeartIcon } from '@heroicons/react/24/outline';

export default function WishlistPage() {
    const { wishlist } = useWishlist();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-8 tracking-tight">
                Mes Favoris
            </h1>

            {wishlist.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm flex flex-col items-center">
                    <HeartIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Votre liste de favoris est vide</h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
                        Découvrez nos produits et ajoutez vos coups de cœur pour les retrouver facilement plus tard.
                    </p>
                    <Link to="/shop" className="btn-primary inline-flex items-center">
                        Explorer la boutique
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {wishlist.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
