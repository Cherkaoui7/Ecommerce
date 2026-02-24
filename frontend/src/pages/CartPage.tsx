import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ImageWithFallback from '../components/ui/ImageWithFallback';

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, totalPrice } = useCart();

    if (items.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6">Votre panier est vide</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                    On dirait que vous n'avez pas encore trouvé votre bonheur. Découvrez nos nouveautés !
                </p>
                <Link
                    to="/shop"
                    className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
                >
                    Retourner à la boutique
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-10 tracking-tight">Votre Panier</h1>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Liste des articles */}
                <div className="w-full lg:w-2/3">
                    <ul className="divide-y divide-gray-200 dark:divide-gray-800 border-t border-b border-gray-200 dark:border-gray-800">
                        {items.map((item) => {
                            const price = typeof item.product.price === 'string' ? parseFloat(item.product.price) : item.product.price;

                            return (
                                <li key={item.product.id} className="py-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                    <div className="flex-shrink-0 w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
                                        <ImageWithFallback
                                            src={item.product.image_url || undefined}
                                            alt={item.product.name}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between h-auto w-full text-center sm:text-left">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                    <Link to={`/products/${item.product.id}`} className="hover:text-blue-600 transition">
                                                        {item.product.name}
                                                    </Link>
                                                </h3>
                                                <p className="text-lg font-black text-gray-900 dark:text-white hidden sm:block">
                                                    {(price * item.quantity).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                                </p>
                                            </div>
                                            {item.product.category && (
                                                <p className="mt-1 text-sm text-blue-600 dark:text-blue-400 font-medium">
                                                    {item.product.category.name}
                                                </p>
                                            )}
                                        </div>

                                        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                                            <div className="flex items-center border-2 border-gray-200 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 h-10">
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                                                    className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-blue-600 transition"
                                                >
                                                    -
                                                </button>
                                                <span className="w-12 text-center font-semibold text-gray-900 dark:text-white">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, Math.min(item.product.stock, item.quantity + 1))}
                                                    className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-blue-600 transition"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item.product.id)}
                                                className="text-sm font-medium text-red-500 hover:text-red-700 transition"
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Résumé de commande */}
                <div className="w-full lg:w-1/3">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 sticky top-24">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Résumé de la commande</h2>

                        <dl className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex justify-between">
                                <dt>Sous-total</dt>
                                <dd className="font-medium text-gray-900 dark:text-white">
                                    {totalPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt>Frais de livraison</dt>
                                <dd className="font-medium text-green-600 dark:text-green-400">Gratuit</dd>
                            </div>
                            <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 !mt-6">
                                <dt className="text-lg font-black text-gray-900 dark:text-white">Total TTC</dt>
                                <dd className="text-xl font-black text-blue-600 dark:text-blue-400">
                                    {totalPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                </dd>
                            </div>
                        </dl>

                        <Link
                            to="/checkout"
                            className="mt-8 w-full flex items-center justify-center px-6 py-4 border border-transparent rounded-full shadow-lg text-base font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition transform hover:-translate-y-0.5"
                        >
                            Commander
                        </Link>

                        <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
                            Taxes incluses et frais de port calculés à l'étape suivante.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
