import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { fetchProducts } from '../features/products/productApi';
import ProductCard from '../components/ui/ProductCard';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import { getApiErrorMessage } from '../utils/apiError';
import {
    TruckIcon,
    ShieldCheckIcon,
    ArrowPathIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';

export default function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                // Fetch latest products
                const response = await fetchProducts(1);
                // Keep only top 4 for the homepage strip
                setProducts(response.data.data.slice(0, 4));
            } catch (err: unknown) {
                setError(getApiErrorMessage(err, 'Erreur lors du chargement des produits.'));
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, []);

    const features = [
        {
            name: 'Livraison Rapide & Gratuite',
            description: 'Offerte des 50 EUR d\'achat. Expedition en 24h.',
            icon: TruckIcon,
        },
        {
            name: 'Paiement 100% Securise',
            description: 'Chiffrage SSL et protection des donnees garantie.',
            icon: ShieldCheckIcon,
        },
        {
            name: 'Satisfait ou Rembourse',
            description: '30 jours pour retourner vos articles gratuitement.',
            icon: ArrowPathIcon,
        },
        {
            name: 'Qualite Certifiee',
            description: 'Des produits authentiques et durables.',
            icon: SparklesIcon,
        },
    ];

    const testimonials = [
        {
            id: 1,
            content: "J'ai ete bluffee par la qualite du cuir du sac que j'ai commande. C'est exactement comme sur les photos, voire mieux. La livraison etait super rapide.",
            author: "Camille V.",
            role: "Fashion Addict",
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        },
        {
            id: 2,
            content: "Enfin un site qui propose des produits tech avec un vrai souci du design. J'ai achete mes ecouteurs ici et je ne les quitte plus.",
            author: "Lucas M.",
            role: "Developpeur",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        },
        {
            id: 3,
            content: "Le service client est exceptionnel. J'avais une question sur une taille et ils m'ont repondu dans l'heure. Une experience client parfaite.",
            author: "Sarah B.",
            role: "Architecte",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        }
    ];

    return (
        <div className="space-y-24 pb-24">

            {/* Hero Section */}
            <div className="relative isolate px-6 pt-14 lg:px-8">
                <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                    <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
                </div>

                <div className="mx-auto max-w-7xl py-12 sm:py-20 lg:py-24">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2 lg:items-center">
                        <div className="text-center lg:text-left">
                            <h1 className="text-4xl font-black tracking-tight text-gray-900 sm:text-6xl dark:text-white leading-[1.1]">
                                Elevez Votre <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400">Style & Quotidien.</span>
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                                Une selection meticuleuse de produits qui allient esthetique intemporelle et fonctionnalite moderne.
                                Redecouvrez le plaisir de l'excellence.
                            </p>
                            <div className="mt-10 flex items-center justify-center lg:justify-start gap-x-6">
                                <Link to="/shop" className="rounded-full bg-primary-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-primary-500 hover:shadow-primary-500/30 transform hover:-translate-y-1 transition-all duration-300">
                                    Decouvrir la Collection
                                </Link>
                                <a href="#features" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white group flex items-center gap-2">
                                    En savoir plus <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                                </a>
                            </div>
                        </div>
                        <div className="relative lg:col-span-1">
                            <ImageWithFallback
                                src="https://picsum.photos/seed/storehero/1920/1080"
                                alt="Collection Showcase"
                                className="aspect-[4/3] w-full rounded-3xl bg-gray-50 object-cover lg:aspect-auto lg:h-[500px] shadow-2xl ring-1 ring-gray-900/10 transform rotate-2 hover:rotate-0 transition-transform duration-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
                    <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
                </div>
            </div>

            {/* Features Section */}
            <div id="features" className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-semibold leading-7 text-primary-600 dark:text-primary-400 uppercase tracking-wider">Nos Engagements</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                        L'experience client avant tout
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
                        {features.map((feature) => (
                            <div key={feature.name} className="flex flex-col items-center text-center lg:items-start lg:text-left bg-white dark:bg-gray-800/50 p-6 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                                    <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                                        <feature.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" aria-hidden="true" />
                                    </div>
                                    {feature.name}
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                                    <p className="flex-auto">{feature.description}</p>
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>

            {/* Bento Grid layout for Categories */}
            <section className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">Nos Univers</h2>
                        <p className="mt-3 text-lg text-gray-500 dark:text-gray-400 max-w-2xl">Explorez nos collections curees avec passion.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-full">
                    {/* Bento Block 1 - Large Focus */}
                    <Link to="/shop?category=fashion" className="group relative rounded-3xl overflow-hidden aspect-[4/3] md:col-span-2 md:row-span-2 shadow-sm hover:shadow-xl transition-all duration-500 card-hover bg-gray-100 dark:bg-gray-800">
                        <ImageWithFallback
                            src="https://picsum.photos/seed/urbanchic/800/600"
                            alt="Mode Urbaine"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute inset-0 p-8 flex flex-col justify-end">
                            <span className="text-white/80 text-sm font-bold tracking-widest uppercase mb-2">Collection 2026</span>
                            <h3 className="text-4xl font-black text-white mb-2">Mode Urbaine</h3>
                            <p className="text-gray-200 max-w-md hidden sm:block font-medium">L'elegance decontractee pour ceux qui bougent.</p>
                            <span className="mt-6 inline-flex items-center space-x-2 text-white font-bold group-hover:text-primary-300 transition-colors">
                                <span>Explorer</span>
                                <span aria-hidden="true" className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                            </span>
                        </div>
                    </Link>

                    {/* Bento Block 2 - Tech */}
                    <Link to="/shop?category=tech" className="group relative rounded-3xl overflow-hidden aspect-square md:aspect-auto shadow-sm hover:shadow-xl transition-all duration-500 card-hover bg-gray-100 dark:bg-gray-800">
                        <ImageWithFallback
                            src="https://picsum.photos/seed/hightech/800/800"
                            alt="Tech & Audio"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute inset-0 p-8 flex flex-col justify-end">
                            <h3 className="text-2xl font-black text-white mb-1">Tech & Audio</h3>
                            <p className="text-gray-300 text-sm line-clamp-2 mb-3">Le futur a portee de main.</p>
                            <span className="inline-flex items-center space-x-2 text-white/90 text-sm font-bold group-hover:text-primary-300 transition-colors">
                                <span>Voir les produits</span>
                                <span aria-hidden="true" className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                            </span>
                        </div>
                    </Link>

                    {/* Bento Block 3 - Accessoires */}
                    <Link to="/shop?category=accessories" className="group relative rounded-3xl overflow-hidden aspect-square md:aspect-auto shadow-sm hover:shadow-xl transition-all duration-500 card-hover bg-gray-100 dark:bg-gray-800">
                        <ImageWithFallback
                            src="https://picsum.photos/seed/luxury/800/800"
                            alt="Accessoires Luxe"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute inset-0 p-8 flex flex-col justify-end">
                            <h3 className="text-2xl font-black text-white mb-1">Accessoires Luxe</h3>
                            <p className="text-gray-300 text-sm line-clamp-2 mb-3">La touche finale parfaite.</p>
                            <span className="inline-flex items-center space-x-2 text-white/90 text-sm font-bold group-hover:text-primary-300 transition-colors">
                                <span>Voir les produits</span>
                                <span aria-hidden="true" className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                            </span>
                        </div>
                    </Link>
                </div>
            </section>

            {/* Latest Products Carousel / Grid */}
            <section className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mb-10 flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Dernieres Arrivees</h2>
                        <p className="mt-2 text-gray-500 dark:text-gray-400">Les nouveautes exclusives fraichement ajoutees au catalogue.</p>
                    </div>
                    <Link to="/shop" className="hidden sm:inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 font-bold hover:text-primary-700 dark:hover:text-primary-300 transition-colors group">
                        <span>Voir tout le catalogue</span>
                        <span aria-hidden="true" className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-[2rem] aspect-[4/5] w-full"></div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="p-6 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl border border-red-100 dark:border-red-800 flex items-center space-x-3">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p className="font-semibold">{error}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>

            {/* Testimonials */}
            <section className="bg-gray-50 dark:bg-gray-800 py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-xl text-center">
                        <h2 className="text-lg font-semibold leading-8 tracking-tight text-primary-600 dark:text-primary-400">Temoignages</h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                            Ce que nos clients disent
                        </p>
                    </div>
                    <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {testimonials.map((testimonial) => (
                                <div key={testimonial.id} className="rounded-2xl bg-white dark:bg-gray-900 p-8 shadow-lg ring-1 ring-gray-900/5 hover:shadow-xl transition-shadow duration-300">
                                    <blockquote className="text-gray-900 dark:text-gray-200 italic relative">
                                        <span className="text-4xl text-primary-200 absolute -top-4 -left-2">"</span>
                                        <p className="relative z-10 pl-2">"{testimonial.content}"</p>
                                    </blockquote>
                                    <div className="mt-6 flex items-center gap-x-4">
                                        <ImageWithFallback
                                            src={testimonial.image}
                                            alt={testimonial.author}
                                            className="h-12 w-12 rounded-full bg-gray-50 object-cover ring-2 ring-primary-100 dark:ring-primary-900"
                                        />
                                        <div>
                                            <div className="font-bold">{testimonial.author}</div>
                                            <div className="text-primary-600 dark:text-primary-400 text-sm font-medium">{testimonial.role}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="relative isolate overflow-hidden bg-gray-900 py-16 sm:py-24 lg:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
                        <div className="max-w-xl lg:max-w-lg">
                            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Restez connecte.</h2>
                            <p className="mt-4 text-lg leading-8 text-gray-300">
                                Rejoignez notre communaute et recevez -10% sur votre premiere commande.
                            </p>
                            <div className="mt-6 flex max-w-md gap-x-4">
                                <label htmlFor="email-address" className="sr-only">Adresse email</label>
                                <input id="email-address" name="email" type="email" autoComplete="email" required className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6" placeholder="Votre email" />
                                <button type="submit" className="flex-none rounded-md bg-primary-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 transition-colors">Je m'inscris</button>
                            </div>
                        </div>
                        <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
                            <div className="flex flex-col items-start">
                                <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                                    <ArrowPathIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                </div>
                                <dt className="mt-4 font-semibold text-white">Nouveautes en avant-premiere</dt>
                                <dd className="mt-2 leading-7 text-gray-400">Soyez les premiers informes de nos drops exclusifs.</dd>
                            </div>
                            <div className="flex flex-col items-start">
                                <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                                    <ShieldCheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                </div>
                                <dt className="mt-4 font-semibold text-white">Confidentialite garantie</dt>
                                <dd className="mt-2 leading-7 text-gray-400">Desinscription possible a tout moment. Zero spam.</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </section>
        </div>
    );
}
