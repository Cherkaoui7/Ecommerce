interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
    width?: string | number;
    height?: string | number;
    count?: number;
}

export default function SkeletonLoader({ 
    className = '', 
    variant = 'rectangular',
    width,
    height,
    count = 1
}: SkeletonProps) {
    const baseClasses = "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%] skeleton-wave";
    
    const variantClasses = {
        text: 'h-4 rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-none',
        rounded: 'rounded-lg',
    };

    const style: React.CSSProperties = {};
    if (width) style.width = typeof width === 'number' ? `${width}px` : width;
    if (height) style.height = typeof height === 'number' ? `${height}px` : height;

    const skeletons = Array.from({ length: count }, (_, i) => (
        <div
            key={i}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
        />
    ));

    return count > 1 ? <div className="space-y-3">{skeletons}</div> : skeletons[0];
}

// Predefined skeleton components
export function ProductCardSkeleton() {
    return (
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border p-4">
            <SkeletonLoader variant="rounded" height={240} className="mb-4" />
            <SkeletonLoader variant="text" width="60%" className="mb-2" />
            <SkeletonLoader variant="text" width="100%" className="mb-2" />
            <SkeletonLoader variant="text" width="80%" className="mb-4" />
            <div className="flex justify-between items-center">
                <SkeletonLoader variant="text" width={80} height={24} />
                <SkeletonLoader variant="circular" width={40} height={40} />
            </div>
        </div>
    );
}

export function OrderItemSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg px-4 py-6 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div className="flex-1">
                    <SkeletonLoader variant="text" width={120} className="mb-2" />
                    <SkeletonLoader variant="text" width={200} className="mb-2" />
                    <SkeletonLoader variant="text" width={150} />
                </div>
                <div className="mt-2 sm:mt-0">
                    <SkeletonLoader variant="text" width={100} height={28} className="mb-2" />
                    <SkeletonLoader variant="rounded" width={80} height={24} />
                </div>
            </div>
            <div className="border-t border-gray-100 dark:border-gray-700/50 pt-4">
                <SkeletonLoader variant="text" count={3} />
            </div>
        </div>
    );
}

export function CategoryCardSkeleton() {
    return (
        <div className="relative overflow-hidden rounded-3xl shadow-xl h-80 md:h-96">
            <SkeletonLoader variant="rectangular" className="absolute inset-0" />
        </div>
    );
}
