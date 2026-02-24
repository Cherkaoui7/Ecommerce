import { useState } from 'react';

export default function ContactPage() {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        // Simulate API call
        setTimeout(() => {
            setStatus('success');
        }, 1500);
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Infos Contact */}
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black mb-6 text-gray-900 dark:text-white">
                            Contactez-nous
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                            Nous sommes là pour vous aider. Que vous ayez une question sur un produit, une commande ou nos services, n'hésitez pas à nous envoyer un message.
                        </p>

                        <div className="space-y-6">
                            <div className="glass-card p-6 rounded-2xl flex items-start space-x-4">
                                <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-xl flex-shrink-0">
                                    <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Email</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1">support@nexuscart.com</p>
                                    <p className="text-sm text-gray-500 mt-1">Réponse sous 24h ouvrées</p>
                                </div>
                            </div>

                            <div className="glass-card p-6 rounded-2xl flex items-start space-x-4">
                                <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-xl flex-shrink-0">
                                    <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Téléphone</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1">+33 1 23 45 67 89</p>
                                    <p className="text-sm text-gray-500 mt-1">Lun-Ven, 9h-18h</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Formulaire */}
                    <div className="glass-card rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-800">
                        {status === 'success' ? (
                            <div className="h-full flex flex-col items-center justify-center space-y-4 py-12 text-center">
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Message Envoyé !</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Merci de nous avoir contactés. Notre équipe vous répondra dans les plus brefs délais.
                                </p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="mt-6 text-primary-600 font-semibold hover:underline"
                                >
                                    Envoyer un autre message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prénom</label>
                                        <input type="text" id="firstName" required className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-colors" placeholder="Jean" />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom</label>
                                        <input type="text" id="lastName" required className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-colors" placeholder="Dupont" />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                                    <input type="email" id="email" required className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-colors" placeholder="jean.dupont@example.com" />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sujet</label>
                                    <select id="subject" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-colors">
                                        <option>Question sur un produit</option>
                                        <option>Suivi de commande</option>
                                        <option>Retour et remboursement</option>
                                        <option>Problème technique</option>
                                        <option>Autre</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                                    <textarea id="message" rows={5} required className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-colors resize-none" placeholder="Comment pouvons-nous vous aider ?"></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'submitting'}
                                    className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg transition-all shadow-md ${status === 'submitting'
                                            ? 'bg-primary-400 cursor-not-allowed'
                                            : 'bg-primary-600 hover:bg-primary-700 hover:shadow-lg transform hover:-translate-y-1'
                                        }`}
                                >
                                    {status === 'submitting' ? 'Envoi en cours...' : 'Envoyer le message'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
