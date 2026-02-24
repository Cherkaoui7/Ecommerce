export default function TermsPage() {
    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12 border-b border-gray-200 dark:border-gray-800 pb-8">
                    <h1 className="text-4xl font-black mb-4 text-gray-900 dark:text-white">
                        Conditions Générales de Vente (CGV)
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Veuillez lire attentivement les présentes conditions avant d'utiliser notre plateforme.
                    </p>
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Objet</h2>
                        <p>
                            Les présentes Conditions Générales de Vente (ci-après "CGV") régissent les droits et obligations
                            des parties dans le cadre de la vente de produits proposés par NexusCart sur notre site web.
                            Toute commande passée sur la plateforme implique l'acceptation sans réserve de ces CGV.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Produits et Prix</h2>
                        <p>
                            Les produits proposés à la vente sont ceux qui figurent sur le site NexusCart, accompagnés d'une description
                            détaillée. Les prix sont indiqués en Euros, toutes taxes comprises (TTC), hors frais de livraison
                            qui sont calculés lors du passage en caisse. Nous nous réservons le droit de modifier nos prix à tout moment.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Commandes</h2>
                        <p>
                            Le client valide sa commande en complétant le processus de paiement. La commande ne sera définitive
                            qu'après acceptation du paiement. NexusCart confirmera l'acceptation de la commande à l'utilisateur
                            par message électronique (e-mail).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Paiement</h2>
                        <p>
                            Le règlement des achats s'effectue via les moyens de paiement sécurisés proposés sur le site (Carte
                            bancaire, PayPal, etc.). La plateforme utilise un protocole HTTPS crypté pour garantir la sécurité
                            des transactions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Droit de rétractation</h2>
                        <p>
                            Conformément à la législation en vigueur, le consommateur dispose d'un délai de 30 jours calendaires
                            à compter de la réception du produit pour exercer son droit de rétractation sans avoir à justifier de motifs.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Litiges</h2>
                        <p>
                            Les présentes conditions sont soumises à la loi française. En cas de litige, une solution amiable sera
                            recherchée avant toute action judiciaire. À défaut, les tribunaux français seront seuls compétents.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
