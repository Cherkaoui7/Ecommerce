import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                            NexusCart
                        </Link>
                        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                            La meilleure boutique en ligne pour vos achats au quotidien. Nous offrons des produits de qualité à des prix imbattables.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Boutique</h3>
                        <ul className="mt-4 space-y-4">
                            <li><Link to="/shop" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Tous les produits</Link></li>
                            <li><Link to="/categories" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Catégories</Link></li>
                            <li><Link to="/promos" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Promotions</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Support</h3>
                        <ul className="mt-4 space-y-4">
                            <li><Link to="/faq" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">FAQ</Link></li>
                            <li><Link to="/contact" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Contact</Link></li>
                            <li><Link to="/shipping" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Livraison</Link></li>
                            <li><Link to="/returns" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Retours</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Légal</h3>
                        <ul className="mt-4 space-y-4">
                            <li><Link to="/privacy" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Confidentialité</Link></li>
                            <li><Link to="/terms" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">CGV</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-base text-gray-400 xl:text-center">
                        &copy; {new Date().getFullYear()} NexusCart. Tous droits réservés.
                    </p>
                </div>
            </div>
        </footer>
    );
}
