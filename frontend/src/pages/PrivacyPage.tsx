export default function PrivacyPage() {
    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <h1 className="text-4xl font-black mb-4 text-gray-900 dark:text-white">
                        Politique de Confidentialité
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
                    </p>
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 space-y-8 glass-card p-8 md:p-12 rounded-3xl border border-gray-100 dark:border-gray-800">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Introduction</h2>
                        <p>
                            Chez NexusCart, nous accordons une grande importance à la protection de vos données personnelles.
                            Cette politique de confidentialité vise à vous informer sur la manière dont nous collectons, utilisons,
                            et protégeons vos informations lorsque vous utilisez notre site web et nos services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Données collectées</h2>
                        <p>Nous collectons les types d'informations suivants :</p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li><strong>Informations d'identification :</strong> Nom, prénom, adresse email.</li>
                            <li><strong>Informations transactionnelles :</strong> Adresse de facturation, adresse de livraison, détails des commandes.</li>
                            <li><strong>Informations techniques :</strong> Adresse IP, type de navigateur, données de navigation via l'utilisation de cookies.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Utilisation de vos données</h2>
                        <p>Vos données personnelles sont principalement utilisées pour :</p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li>Traiter et expédier vos commandes.</li>
                            <li>Communiquer avec vous concernant vos achats (suivi, factures).</li>
                            <li>Améliorer la sécurité de notre plateforme et prévenir la fraude.</li>
                            <li>Vous envoyer notre newsletter (uniquement si vous y avez consenti).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Partage des données</h2>
                        <p>
                            Nous ne vendons, n'échangeons, ni ne transférons vos informations personnelles identifiables à des
                            tiers, à l'exception des tiers de confiance qui nous aident à exploiter notre site Web (comme nos
                            prestataires de paiement sécurisé Stripe, ou nos transporteurs), tant que ces parties conviennent de
                            garder ces informations confidentielles.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Vos droits (RGPD)</h2>
                        <p>
                            Conformément à la réglementation européenne (RGPD), vous disposez d'un droit d'accès, de rectification,
                            d'effacement, et de portabilité de vos données. Vous pouvez également vous opposer à leur traitement.
                            Pour exercer ces droits, veuillez nous contacter via notre page de support.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
