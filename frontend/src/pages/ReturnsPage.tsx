import { ArrowPathIcon, CheckBadgeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function ReturnsPage() {
    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-black mb-4 text-gray-900 dark:text-white">
                        Retours & Remboursements
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Votre satisfaction est notre priorité. Découvrez notre politique de retour sous 30 jours.
                    </p>
                </div>

                <div className="glass-card rounded-3xl p-8 mb-12 border border-gray-100 dark:border-gray-800">
                    <div className="flex flex-col md:flex-row items-center justify-around space-y-8 md:space-y-0">
                        <div className="text-center max-w-xs">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-black">30</span>
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Jours pour changer d'avis</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">À compter de la date de réception de votre colis.</p>
                        </div>

                        <div className="hidden md:block w-px h-24 bg-gray-200 dark:bg-gray-800"></div>

                        <div className="text-center max-w-xs">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ArrowPathIcon className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Retours Simplifiés</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Étiquette de retour prépayée disponible dans votre espace client.</p>
                        </div>

                        <div className="hidden md:block w-px h-24 bg-gray-200 dark:bg-gray-800"></div>

                        <div className="text-center max-w-xs">
                            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckBadgeIcon className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Remboursement Rapide</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Effectué sous 5 à 7 jours après réception de l'article.</p>
                        </div>
                    </div>
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-400">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Conditions de retour</h2>
                    <p>Pour être éligible à un retour, votre article doit remplir les conditions suivantes :</p>
                    <ul className="list-disc pl-6 space-y-2 mb-8">
                        <li>Il doit être inutilisé et dans le même état que vous l'avez reçu.</li>
                        <li>Il doit être dans son emballage d'origine, avec toutes les étiquettes attachées.</li>
                        <li>Il doit être accompagné du reçu ou de la preuve d'achat.</li>
                    </ul>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded-r-xl my-8 flex items-start">
                        <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
                        <p className="text-yellow-800 dark:text-yellow-200 text-sm m-0">
                            <strong>Attention :</strong> Certains articles ne peuvent pas être retournés pour des raisons d'hygiène et de sécurité, notamment les sous-vêtements, les boucles d'oreilles, et les cosmétiques une fois descellés.
                        </p>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Comment effectuer un retour ?</h2>
                    <ol className="list-decimal pl-6 space-y-4">
                        <li><strong>Connectez-vous</strong> à votre compte client et rendez-vous dans la section "Mes Commandes".</li>
                        <li><strong>Sélectionnez</strong> la commande concernée et cliquez sur "Effectuer un retour".</li>
                        <li><strong>Choisissez</strong> les articles à retourner et indiquez le motif du retour.</li>
                        <li><strong>Imprimez</strong> l'étiquette de retour prépayée et déposez votre colis dans un point relais de notre transporteur.</li>
                    </ol>

                    <p className="font-medium text-gray-900 dark:text-white mt-8 border-t border-gray-200 dark:border-gray-800 pt-6">
                        Une fois votre retour inspecté et validé par notre entrepôt, vous serez immédiatement notifié par email et le remboursement sera déclenché sur votre moyen de paiement initial.
                    </p>
                </div>
            </div>
        </div>
    );
}
