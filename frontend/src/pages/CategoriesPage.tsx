import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Category } from '../types';
import { fetchCategories } from '../features/categories/categoryApi';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

// Fallback images and descriptions per category name
const CATEGORY_META: Record<string, { image: string; description: string; tag: string; color: string }> = {
    'Tech & Audio': {
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
        description: 'Casques premium, enceintes, gadgets et tout ce que le monde de la tech a de mieux.',
        tag: 'Nouvelles arrivées',
        color: 'from-blue-600/80 to-indigo-900/90',
    },
    'Mode Urbaine': {
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
        description: 'Montres, vêtements et accessoires pour un style urbain moderne et authentique.',
        tag: 'Tendances',
        color: 'from-rose-600/80 to-pink-900/90',
    },
    'Accessoires Luxe': {
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
        description: 'Sacs, maroquinerie et pièces d\'exception pour une élégance intemporelle.',
        tag: 'Exclusif',
        color: 'from-amber-500/80 to-yellow-800/90',
    },
};

// Default meta for any unknown category
const DEFAULT_META = {
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80',
    description: 'Découvrez notre sélection de produits dans cette catégorie.',
    tag: 'Explorer',
    color: 'from-gray-600/80 to-gray-900/90',
};

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetchCategories();
                setCategories(res.data);
            } catch {
                setError('Impossible de charger les catégories. Veuillez réessayer.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div className="animate-fade-in">
            {/* Hero Banner */}
            <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-24 px-4">
                <div className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
                <div className="relative max-w-7xl mx-auto text-center">
                    <span className="inline-block px-3 py-1 text-xs font-bold tracking-widest uppercase bg-primary-600/20 text-primary-400 rounded-full ring-1 ring-primary-500/30 mb-4">
                        Notre catalogue
                    </span>
                    <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
                        Explorez par<br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-blue-400">
                            Catégorie
                        </span>
                    </h1>
                    <p className="mt-6 text-lg text-gray-300 max-w-xl mx-auto">
                        Des produits soigneusement sélectionnés pour chaque univers. Découvrez l'excellence dans chaque collection.
                    </p>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-3xl h-96" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-16 text-red-500">{error}</div>
                ) : (
                    <>
                        {/* Featured large cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            {categories.map((cat, index) => {
                                const meta = CATEGORY_META[cat.name] ?? DEFAULT_META;
                                const isWide = index === 0;
                                return (
                                    <Link
                                        key={cat.id}
                                        to={`/shop?category=${cat.id}`}
                                        className={`group relative overflow-hidden rounded-3xl shadow-xl cursor-pointer
                                            ${isWide ? 'md:col-span-2 h-80 md:h-96' : 'h-80 md:h-96'}`}
                                    >
                                        {/* Background image */}
                                        <img
                                            src={meta.image}
                                            alt={cat.name}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />

                                        {/* Gradient overlay */}
                                        <div className={`absolute inset-0 bg-gradient-to-t ${meta.color} opacity-70 group-hover:opacity-80 transition-opacity duration-300`} />

                                        {/* Content */}
                                        <div className="absolute inset-0 flex flex-col justify-end p-8">
                                            <span className="inline-block self-start mb-3 px-2.5 py-0.5 text-xs font-bold tracking-widest uppercase text-white bg-white/20 rounded-full ring-1 ring-white/30 backdrop-blur-sm">
                                                {meta.tag}
                                            </span>
                                            <h2 className="text-3xl font-black text-white leading-tight mb-2">{cat.name}</h2>
                                            <p className="text-sm text-white/80 max-w-xs mb-4 leading-relaxed">{meta.description}</p>
                                            <div className="flex items-center gap-2 text-white/90 group-hover:gap-3 transition-all duration-200">
                                                <span className="text-sm font-semibold">Explorer la collection</span>
                                                <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* "All products" banner */}
                        <Link
                            to="/shop"
                            className="group relative w-full flex items-center justify-between overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 to-blue-600 p-8 shadow-xl hover:shadow-primary-500/20 transition-all duration-300"
                        >
                            <div>
                                <p className="text-xs font-bold tracking-widest uppercase text-primary-200 mb-1">Ne pas choisir ?</p>
                                <h3 className="text-2xl font-black text-white">Voir tous les produits</h3>
                                <p className="mt-1 text-sm text-primary-200">Parcourez l'intégralité de notre catalogue sans filtre.</p>
                            </div>
                            <div className="flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors duration-200">
                                <ArrowRightIcon className="h-6 w-6 text-white transition-transform duration-200 group-hover:translate-x-1" />
                            </div>
                        </Link>
                    </>
                )}
            </section>

            {/* Why shop by category section */}
            <section className="bg-gray-50 dark:bg-gray-900/50 py-16 border-t border-gray-100 dark:border-dark-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-center text-2xl font-black text-gray-900 dark:text-white mb-12">Pourquoi acheter par catégorie ?</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {[
                            { icon: '🎯', title: 'Sélection ciblée', desc: 'Concentrez-vous sur ce qui vous intéresse vraiment, sans bruit inutile.' },
                            { icon: '✨', title: 'Curation experte', desc: 'Chaque catégorie est filtrée par nos équipes pour ne garder que l\'essentiel.' },
                            { icon: '🚀', title: 'Navigation rapide', desc: 'Trouvez le bon produit en quelques secondes, sans effort.' },
                        ].map((item) => (
                            <div key={item.title} className="text-center p-6 rounded-2xl bg-white dark:bg-dark-card shadow-sm border border-gray-100 dark:border-dark-border">
                                <span className="text-4xl">{item.icon}</span>
                                <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">{item.title}</h3>
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
