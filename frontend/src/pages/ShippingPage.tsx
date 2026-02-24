import { TruckIcon, GlobeEuropeAfricaIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function ShippingPage() {
    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-black mb-4 text-gray-900 dark:text-white">
                        Informations de Livraison
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Découvrez toutes les options et tarifs pour recevoir vos commandes.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="glass-card p-8 rounded-3xl text-center border border-gray-100 dark:border-gray-800">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <TruckIcon className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Standard</h3>
                        <p className="text-gray-500 font-medium mb-4">3 à 5 jours ouvrés</p>
                        <p className="text-2xl font-black text-gray-900 dark:text-white">4,99 €</p>
                        <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-2">Gratuit dès 50€ d'achat</p>
                    </div>

                    <div className="glass-card p-8 rounded-3xl text-center border-2 border-primary-500 relative transform md:-translate-y-4 shadow-xl">
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-sm">
                            Plus Rapide
                        </div>
                        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <ClockIcon className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Express</h3>
                        <p className="text-gray-500 font-medium mb-4">24h à 48h ouvrées</p>
                        <p className="text-2xl font-black text-gray-900 dark:text-white">9,99 €</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Suivi prioritaire inclus</p>
                    </div>

                    <div className="glass-card p-8 rounded-3xl text-center border border-gray-100 dark:border-gray-800">
                        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <GlobeEuropeAfricaIcon className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">International</h3>
                        <p className="text-gray-500 font-medium mb-4">5 à 10 jours ouvrés</p>
                        <p className="text-2xl font-black text-gray-900 dark:text-white">14,99 €</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Europe (hors UE) et Suisse</p>
                    </div>
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2">Suivi de commande</h2>
                    <p>
                        Dès que votre commande quitte notre entrepôt, vous recevrez un email de confirmation d'expédition contenant un numéro de suivi.
                        Vous pourrez ainsi suivre l'acheminement de votre colis en temps réel sur le site de notre transporteur partenaire (Colissimo, Chronopost ou DHL).
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2 mt-10">Zones de livraison</h2>
                    <p>
                        Nous livrons actuellement dans les zones suivantes :
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>France Métropolitaine :</strong> Corse et Monaco inclus.</li>
                        <li><strong>Belgique & Luxembourg :</strong> Tarifs standards applicables.</li>
                        <li><strong>Suisse :</strong> Des frais de douanes peuvent s'appliquer à la réception et sont à la charge du client.</li>
                    </ul>
                    <p className="italic text-sm">
                        * Les délais de livraison sont donnés à titre indicatif et ne tiennent pas compte des éventuels retards dus au transporteur ou aux contrôles douaniers.
                    </p>
                </div>
            </div>
        </div>
    );
}
