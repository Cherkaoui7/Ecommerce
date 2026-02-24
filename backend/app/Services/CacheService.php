<?php

namespace App\Services;

use Closure;
use Illuminate\Cache\TaggableStore;
use Illuminate\Support\Facades\Cache;

class CacheService
{
    /**
     * Cache durations in seconds
     */
    const PRODUCTS_TTL = 3600; // 1 hour
    const CATEGORIES_TTL = 7200; // 2 hours
    const PRODUCT_DETAIL_TTL = 1800; // 30 minutes

    private const PRODUCTS_LIST_INDEX_KEY = 'cache_index_products_list';
    private const PRODUCT_DETAIL_INDEX_KEY = 'cache_index_product_detail';
    private const CATEGORIES_LIST_INDEX_KEY = 'cache_index_categories_list';

    /**
     * Products list cache key (keyed by category + active filter)
     */
    public static function productsKey(?int $categoryId = null, ?bool $isActive = null): string
    {
        return sprintf('products_list_%s_%s', $categoryId ?? 'all', $isActive ?? 'all');
    }

    /**
     * Single product cache key
     */
    public static function productKey(int $productId): string
    {
        return "product_detail_{$productId}";
    }

    /**
     * Categories list cache key
     */
    public static function categoriesKey(): string
    {
        return 'categories_list';
    }

    /**
     * Read products list with cache and track keys for non-taggable stores.
     */
    public static function rememberProductsList(string $cacheKey, Closure $resolver)
    {
        if (self::supportsTags()) {
            return Cache::tags(['products'])->remember($cacheKey, self::PRODUCTS_TTL, $resolver);
        }

        self::registerIndexedKey(self::PRODUCTS_LIST_INDEX_KEY, $cacheKey);

        return Cache::remember($cacheKey, self::PRODUCTS_TTL, $resolver);
    }

    /**
     * Read product detail with cache and track keys for non-taggable stores.
     */
    public static function rememberProductDetail(int $productId, Closure $resolver)
    {
        $cacheKey = self::productKey($productId);

        if (self::supportsTags()) {
            return Cache::tags(['products'])->remember($cacheKey, self::PRODUCT_DETAIL_TTL, $resolver);
        }

        self::registerIndexedKey(self::PRODUCT_DETAIL_INDEX_KEY, $cacheKey);

        return Cache::remember($cacheKey, self::PRODUCT_DETAIL_TTL, $resolver);
    }

    /**
     * Read categories list with cache and track key for non-taggable stores.
     */
    public static function rememberCategories(Closure $resolver)
    {
        $cacheKey = self::categoriesKey();

        if (self::supportsTags()) {
            return Cache::tags(['categories'])->remember($cacheKey, self::CATEGORIES_TTL, $resolver);
        }

        self::registerIndexedKey(self::CATEGORIES_LIST_INDEX_KEY, $cacheKey);

        return Cache::remember($cacheKey, self::CATEGORIES_TTL, $resolver);
    }

    /**
     * Invalidate product-related caches.
     * If $productId is provided, clears detail cache for that product.
     */
    public static function clearProductCaches(?int $productId = null): void
    {
        if (self::supportsTags()) {
            if ($productId !== null) {
                Cache::forget(self::productKey($productId));
            }

            Cache::tags(['products'])->flush();
            return;
        }

        self::clearIndexedKeys(self::PRODUCTS_LIST_INDEX_KEY);

        if ($productId !== null) {
            Cache::forget(self::productKey($productId));
            return;
        }

        self::clearIndexedKeys(self::PRODUCT_DETAIL_INDEX_KEY);
    }

    /**
     * Invalidate category-related caches.
     */
    public static function clearCategoryCaches(): void
    {
        if (self::supportsTags()) {
            Cache::tags(['categories'])->flush();
            return;
        }

        self::clearIndexedKeys(self::CATEGORIES_LIST_INDEX_KEY);
    }

    private static function supportsTags(): bool
    {
        return Cache::getStore() instanceof TaggableStore;
    }

    private static function registerIndexedKey(string $indexKey, string $cacheKey): void
    {
        $keys = Cache::get($indexKey, []);

        if (!is_array($keys)) {
            $keys = [];
        }

        if (!in_array($cacheKey, $keys, true)) {
            $keys[] = $cacheKey;
            Cache::forever($indexKey, $keys);
        }
    }

    private static function clearIndexedKeys(string $indexKey): void
    {
        $keys = Cache::get($indexKey, []);

        if (is_array($keys)) {
            foreach ($keys as $key) {
                if (is_string($key) && $key !== '') {
                    Cache::forget($key);
                }
            }
        }

        Cache::forget($indexKey);
    }
}
