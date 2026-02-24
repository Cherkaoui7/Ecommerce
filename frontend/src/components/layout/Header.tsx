import { Link } from 'react-router-dom';
import { ShoppingCartIcon, UserIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'; // Will need to install @heroicons/react
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
    const { totalItems } = useCart();
    const { isAuthenticated, user } = useAuth();

    return (
        <header className="sticky top-0 z-50 glass-nav shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 dark:from-primary-400 dark:to-primary-300 hover:opacity-80 transition-opacity">
                            NexusCart
                        </Link>
                    </div>

                    {/* Navigation Centrale */}
                    <nav className="hidden md:flex space-x-8">
                        <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                            Accueil
                        </Link>
                        <Link to="/shop" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                            Boutique
                        </Link>
                        <Link to="/categories" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                            Catégories
                        </Link>
                    </nav>

                    {/* Actions (Recherche, User, Panier) */}
                    <div className="flex items-center space-x-4">
                        <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition">
                            <span className="sr-only">Recherche</span>
                            <MagnifyingGlassIcon className="h-6 w-6" />
                        </button>
                        <Link to={isAuthenticated ? "/account" : "/login"} className="relative text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition flex items-center">
                            <span className="sr-only">Mon Compte</span>
                            <UserIcon className="h-6 w-6" />
                            {isAuthenticated && user && (
                                <span className="absolute -top-1 -right-1 flex h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                            )}
                        </Link>
                        <Link to="/cart" className="relative text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition">
                            <span className="sr-only">Panier</span>
                            <ShoppingCartIcon className="h-6 w-6" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
