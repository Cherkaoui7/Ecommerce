import { useEffect } from 'react';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article' | 'product';
    price?: number;
    currency?: string;
}

export default function SEO({
    title = 'NEXUS Store - Boutique en ligne de produits premium',
    description = 'Decouvrez notre selection de produits tech, mode et accessoires de luxe. Livraison gratuite, paiement securise et satisfaction garantie.',
    keywords = 'boutique en ligne, e-commerce, tech, mode, accessoires, livraison gratuite',
    image = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=630',
    url,
    type = 'website',
    price,
    currency = 'EUR'
}: SEOProps) {
    const siteUrl = 'https://nexusstore.com';
    const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
    const fullTitle = title.includes('NEXUS') ? title : `${title} | NEXUS Store`;

    useEffect(() => {
        document.title = fullTitle;

        const setMeta = (key: string, content: string, attr: 'name' | 'property' = 'name') => {
            const selector = `meta[${attr}="${key}"]`;
            let meta = document.head.querySelector<HTMLMetaElement>(selector);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute(attr, key);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        };

        const setLink = (rel: string, href: string) => {
            const selector = `link[rel="${rel}"]`;
            let link = document.head.querySelector<HTMLLinkElement>(selector);
            if (!link) {
                link = document.createElement('link');
                link.setAttribute('rel', rel);
                document.head.appendChild(link);
            }
            link.setAttribute('href', href);
        };

        setMeta('title', fullTitle);
        setMeta('description', description);
        setMeta('keywords', keywords);

        setMeta('og:type', type === 'product' ? 'product' : type, 'property');
        setMeta('og:url', fullUrl, 'property');
        setMeta('og:title', fullTitle, 'property');
        setMeta('og:description', description, 'property');
        setMeta('og:image', image, 'property');
        setMeta('og:site_name', 'NEXUS Store', 'property');
        setMeta('og:locale', 'fr_FR', 'property');

        setMeta('twitter:card', 'summary_large_image', 'property');
        setMeta('twitter:url', fullUrl, 'property');
        setMeta('twitter:title', fullTitle, 'property');
        setMeta('twitter:description', description, 'property');
        setMeta('twitter:image', image, 'property');

        if (type === 'product' && price) {
            setMeta('product:price:amount', price.toString(), 'property');
            setMeta('product:price:currency', currency, 'property');
        }

        setLink('canonical', fullUrl);

        setMeta('robots', 'index, follow');
        setMeta('language', 'French');
        setMeta('revisit-after', '7 days');
        setMeta('author', 'NEXUS Store');
    }, [currency, description, fullTitle, fullUrl, image, keywords, price, type]);

    return null;
}