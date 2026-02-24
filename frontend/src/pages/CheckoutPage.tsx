import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { createOrder } from '../features/orders/orderApi';
import type { OrderPayload } from '../features/orders/orderApi';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import { getApiErrorDetail, getApiErrorMessage, getApiValidationDetails } from '../utils/apiError';

const steps = ['Adresse', 'Paiement', 'Confirmation'];

export default function CheckoutPage() {
    const localOnlyMode = !import.meta.env.VITE_API_URL;
    const { user, isAuthenticated, isLoading } = useAuth();
    const { items, totalPrice, clearCart } = useCart();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(0);

    const [shippingAddress, setShippingAddress] = useState({
        fullName: user?.name || '',
        address: '',
        city: '',
        zipCode: '',
        country: 'France',
    });

    const [cardDetails, setCardDetails] = useState({
        number: '',
        name: '',
        expiry: '',
        cvc: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, isLoading, navigate]);

    if (isLoading || !isAuthenticated) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (items.length === 0 && currentStep !== 2) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center animate-fade-in">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6">Votre panier est vide</h2>
                <Link
                    to="/shop"
                    className="btn-primary"
                >
                    Retourner à la boutique
                </Link>
            </div>
        );
    }

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({ ...prev, [name]: value }));
    };

    const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCardDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = () => {
        if (currentStep === 0) {
            // Basic validation for address
            if (!shippingAddress.fullName || !shippingAddress.address || !shippingAddress.city || !shippingAddress.zipCode) {
                setError("Veuillez remplir tous les champs de l'adresse.");
                return;
            }
            setError(null);
            setCurrentStep(1);
        }
    };

    const handleBack = () => {
        setError(null);
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation for card
        if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvc) {
            setError("Veuillez remplir les informations de paiement simulé.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const payload: OrderPayload = {
            products: items.map(item => ({
                id: item.product.id,
                quantity: item.quantity,
                price: typeof item.product.price === 'string' ? parseFloat(item.product.price) : item.product.price
            })),
            shipping_address: shippingAddress,
            billing_address: shippingAddress,
            payment_method: 'credit_card',
        };

        try {
            await createOrder(payload);
            setCurrentStep(2); // Move to Confirmation step
            clearCart();
        } catch (err: unknown) {
            let errorMsg = getApiErrorMessage(err, 'Une erreur est survenue lors de la validation de la commande.');
            const detailedErrors = getApiValidationDetails(err);
            const detail = getApiErrorDetail(err);
            if (detailedErrors) {
                errorMsg = `${errorMsg} : ${detailedErrors}`;
            }
            if (detail) {
                errorMsg = `${errorMsg} : ${detail}`;
            }
            setError(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepper = () => (
        <nav aria-label="Progress" className="mb-12">
            <ol role="list" className="flex items-center justify-center">
                {steps.map((step, index) => (
                    <li key={step} className={`relative flex items-center ${index !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            {index !== steps.length - 1 && (
                                <div className={`h-[2px] w-full ${currentStep > index ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
                            )}
                        </div>
                        <div className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 ${currentStep > index
                            ? 'bg-primary-600 border-primary-600'
                            : currentStep === index
                                ? 'border-primary-600 bg-white dark:bg-dark-card'
                                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card'
                            }`}>
                            {currentStep > index ? (
                                <CheckCircleIcon className="h-6 w-6 text-white" aria-hidden="true" />
                            ) : (
                                <span className={`text-sm font-bold ${currentStep === index ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                    {index + 1}
                                </span>
                            )}
                        </div>
                        <span className={`absolute -bottom-6 w-max text-xs sm:text-sm font-medium transform -translate-x-1/2 left-1/2 ${currentStep >= index ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                            {step}
                        </span>
                    </li>
                ))}
            </ol>
        </nav>
    );

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-10 tracking-tight text-center">Paiement Sécurisé</h1>

            {localOnlyMode && (
                <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
                    Mode demo: aucune commande reelle n'est envoyee. Cette commande est simulee et stockee localement.
                </div>
            )}

            {renderStepper()}

            {error && (
                <div className="mb-8 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded-xl text-red-700 dark:text-red-400 font-medium text-sm animate-pulse">
                    {error}
                </div>
            )}

            {currentStep === 2 ? (
                /* Success View */
                <div className="bg-white dark:bg-dark-card rounded-3xl shadow-sm border border-gray-100 dark:border-dark-border p-12 text-center animate-fade-in-up">
                    <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-4 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-8 shadow-inner">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-12 h-12">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Commande confirmée !</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-10 max-w-md mx-auto text-lg">
                        {localOnlyMode
                            ? "Mode demo: commande simulee enregistree localement. Aucune commande reelle n'a ete envoyee."
                            : "Merci pour votre achat. Vous recevrez bientot un email de confirmation avec les details de votre commande."}
                    </p>
                    <Link
                        to="/account"
                        className="btn-primary px-8 py-4 text-lg"
                    >
                        Voir mes commandes
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 animate-fade-in-up">
                    {/* Left Column: Form Content */}
                    <div className="w-full lg:w-2/3">
                        <div className="bg-white dark:bg-dark-card rounded-3xl shadow-sm border border-gray-100 dark:border-dark-border p-8">

                            {/* Step 1: Address */}
                            {currentStep === 0 && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 border-b border-gray-100 dark:border-dark-border pb-4">Adresse de livraison</h2>
                                    <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                                        <div className="sm:col-span-2">
                                            <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Nom complet</label>
                                            <input type="text" id="fullName" name="fullName" required value={shippingAddress.fullName} onChange={handleAddressChange} className="mt-2 block w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm text-gray-900 dark:text-white transition-colors" />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label htmlFor="address" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Adresse</label>
                                            <input type="text" id="address" name="address" required value={shippingAddress.address} onChange={handleAddressChange} className="mt-2 block w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm text-gray-900 dark:text-white transition-colors" />
                                        </div>
                                        <div>
                                            <label htmlFor="zipCode" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Code postal</label>
                                            <input type="text" id="zipCode" name="zipCode" required value={shippingAddress.zipCode} onChange={handleAddressChange} className="mt-2 block w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm text-gray-900 dark:text-white transition-colors" />
                                        </div>
                                        <div>
                                            <label htmlFor="city" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Ville</label>
                                            <input type="text" id="city" name="city" required value={shippingAddress.city} onChange={handleAddressChange} className="mt-2 block w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm text-gray-900 dark:text-white transition-colors" />
                                        </div>
                                    </div>
                                    <div className="pt-6 flex justify-end">
                                        <button onClick={handleNext} className="btn-primary">
                                            Continuer vers le paiement
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Payment */}
                            {currentStep === 1 && (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="flex items-center justify-between mb-8 border-b border-gray-100 dark:border-dark-border pb-4">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Paiement</h2>
                                        <button type="button" onClick={handleBack} className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline">
                                            &larr; Modifier l'adresse
                                        </button>
                                    </div>

                                    {/* Credit Card Simulation UI */}
                                    <div className="relative w-full max-w-sm mx-auto bg-gradient-to-tr from-gray-900 to-gray-700 rounded-2xl p-6 shadow-2xl text-white mb-10 transform hover:scale-105 transition-transform duration-300">
                                        <div className="flex justify-between items-center mb-8">
                                            <div className="flex space-x-1">
                                                <div className="w-8 h-5 bg-yellow-400/80 rounded block"></div>
                                                <div className="w-5 h-5 bg-yellow-400/50 rounded-full -ml-3 block mix-blend-multiply"></div>
                                            </div>
                                            <span className="font-bold italic text-lg tracking-widest opacity-80">NEXUS</span>
                                        </div>
                                        <div className="mb-6">
                                            <div className="text-xs text-gray-300 uppercase tracking-widest mb-1">Numéro de Carte</div>
                                            <div className="font-mono text-xl tracking-widest">{cardDetails.number || '•••• •••• •••• ••••'}</div>
                                        </div>
                                        <div className="flex justify-between">
                                            <div>
                                                <div className="text-[10px] text-gray-300 uppercase tracking-widest mb-1">Titulaire</div>
                                                <div className="font-mono text-sm uppercase">{cardDetails.name || 'NOM DU PORTEUR'}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[10px] text-gray-300 uppercase tracking-widest mb-1">Expire le</div>
                                                <div className="font-mono text-sm">{cardDetails.expiry || 'MM/AA'}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Form */}
                                    <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Numéro de carte</label>
                                            <input type="text" name="number" placeholder="0000 0000 0000 0000" maxLength={19} value={cardDetails.number} onChange={handleCardChange} className="mt-2 block w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm text-gray-900 dark:text-white font-mono" />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Titulaire de la carte</label>
                                            <input type="text" name="name" placeholder="John Doe" value={cardDetails.name} onChange={handleCardChange} className="mt-2 block w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm text-gray-900 dark:text-white uppercase" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Date d'expiration</label>
                                            <input type="text" name="expiry" placeholder="MM/AA" maxLength={5} value={cardDetails.expiry} onChange={handleCardChange} className="mt-2 block w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm text-gray-900 dark:text-white font-mono" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">CVC</label>
                                            <input type="text" name="cvc" placeholder="123" maxLength={3} value={cardDetails.cvc} onChange={handleCardChange} className="mt-2 block w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm text-gray-900 dark:text-white font-mono" />
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`w-full ${isSubmitting ? 'btn-secondary text-gray-400 opacity-75 cursor-not-allowed' : 'btn-primary'} py-4 text-lg shadow-lg`}
                                        >
                                            {isSubmitting ? 'Validation en cours...' : `Confirmer et Payer ${totalPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}`}
                                        </button>
                                        <p className="text-center text-xs text-gray-500 mt-4">
                                            {localOnlyMode
                                                ? "Mode demo: paiement simule. Aucune transaction reelle n'est effectuee."
                                                : "Paiement 100% securise simule. Aucune vraie transaction n'est effectuee."}
                                        </p>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-gray-50 dark:bg-gray-800/30 rounded-3xl p-8 sticky top-24 border border-gray-200 dark:border-gray-700/50 shadow-sm backdrop-blur-sm">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Résumé de commande</h2>

                            <ul className="divide-y divide-gray-200 dark:divide-gray-700 mb-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                {items.map((item) => {
                                    const price = typeof item.product.price === 'string' ? parseFloat(item.product.price) : item.product.price;
                                    return (
                                        <li key={item.product.id} className="py-4 flex space-x-4">
                                            <ImageWithFallback
                                                src={item.product.image_url || undefined}
                                                alt={item.product.name}
                                                className="h-16 w-16 rounded-xl object-cover shadow-sm bg-white flex-shrink-0"
                                                loading="lazy"
                                            />
                                            <div className="flex-1 flex flex-col justify-center">
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2">{item.product.name}</h3>
                                                <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mt-1">Qté: {item.quantity}</p>
                                            </div>
                                            <p className="text-sm font-black text-gray-900 dark:text-white self-center whitespace-nowrap">
                                                {(price * item.quantity).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                            </p>
                                        </li>
                                    );
                                })}
                            </ul>

                            <dl className="space-y-4 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-6">
                                <div className="flex items-center justify-between font-semibold">
                                    <dt>Sous-total</dt>
                                    <dd>{totalPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</dd>
                                </div>
                                <div className="flex items-center justify-between font-semibold">
                                    <dt>Livraison</dt>
                                    <dd className="text-green-600 dark:text-green-400 uppercase tracking-widest text-xs font-bold">Gratuite</dd>
                                </div>
                                <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                                    <dt className="text-lg font-black text-gray-900 dark:text-white">Total TTC</dt>
                                    <dd className="text-2xl font-black text-primary-600 dark:text-primary-400">
                                        {totalPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
