import { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackSrc?: string;
}

const inlineFallback = (label?: string) => {
    const safeLabel = (label || 'Product').trim();
    const initial = safeLabel.charAt(0).toUpperCase() || 'P';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="#1f2937"/><text x="50%" y="50%" dy=".35em" text-anchor="middle" fill="#e5e7eb" font-family="Arial,sans-serif" font-size="140">${initial}</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export default function ImageWithFallback({ src, fallbackSrc, alt, ...props }: ImageWithFallbackProps) {
    const [failedSrc, setFailedSrc] = useState<string | undefined>(undefined);
    const generatedFallback = fallbackSrc || inlineFallback(alt);
    const primarySrc = src;
    const isPrimaryFailed = Boolean(primarySrc) && failedSrc === primarySrc;
    const imgSrc = primarySrc ? (isPrimaryFailed ? generatedFallback : primarySrc) : generatedFallback;

    const handleError = () => {
        if (!primarySrc || isPrimaryFailed) {
            return;
        }

        setFailedSrc(primarySrc);
    };

    return (
        <img
            {...props}
            src={imgSrc}
            alt={alt}
            onError={handleError}
        />
    );
}
