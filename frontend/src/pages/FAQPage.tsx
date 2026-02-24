import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const faqs = [
    {
        question: "Quels sont les délais de livraison ?",
        answer: "La livraison standard prend généralement entre 3 et 5 jours ouvrés. La livraison express garantit une réception sous 24 à 48 heures ouvrées."
    },
    {
        question: "Comment puis-je suivre ma commande ?",
        answer: "Une fois votre commande expédiée, vous recevrez un email contenant un lien de suivi. Vous pouvez également suivre l'état dans la section 'Mon Compte'."
    },
    {
        question: "Acceptez-vous les retours ?",
        answer: "Oui, vous disposez d'un délai de 30 jours après réception pour nous retourner un article s'il ne vous convient pas, à l'état neuf et dans son emballage d'origine."
    },
    {
        question: "Quels moyens de paiement sont acceptés ?",
        answer: "Nous acceptons les paiements par carte bancaire (Visa, Mastercard, American Express), PayPal, et Apple Pay."
    },
    {
        question: "Livrez-vous à l'international ?",
        answer: "Pour le moment, nous livrons uniquement en France métropolitaine, en Belgique et en Suisse. Nous espérons étendre nos zones de livraison bientôt."
    }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-16 pb-24">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black mb-4 text-gray-900 dark:text-white">
                        Foire Aux Questions
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Trouvez rapidement les réponses à vos questions les plus fréquentes.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="glass-card rounded-2xl overflow-hidden transition-all duration-200 border border-gray-200 dark:border-gray-800"
                        >
                            <button
                                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            >
                                <span className="font-semibold text-gray-900 dark:text-white pr-8">
                                    {faq.question}
                                </span>
                                <ChevronDownIcon
                                    className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
                                />
                            </button>

                            <div
                                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                        Vous ne trouvez pas votre réponse ? <br className="sm:hidden" />
                        <a href="/contact" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline mt-2 inline-block">
                            Contactez notre support client
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
