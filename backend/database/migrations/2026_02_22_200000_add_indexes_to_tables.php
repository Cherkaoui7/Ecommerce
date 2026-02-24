<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration 
{
    public function up(): void
    {
        // Products table indexes
        Schema::table('products', function (Blueprint $table) {
            $table->index('category_id', 'products_category_id_index');
            $table->index('is_active', 'products_is_active_index');
            $table->index('slug', 'products_slug_index');
            $table->index('sku', 'products_sku_index');
            // Composite: category + active — most common query pattern
            $table->index(['category_id', 'is_active'], 'products_category_active_index');
            // Composite: active + created — for "newest active products"
            $table->index(['is_active', 'created_at'], 'products_active_created_index');
        });

        // Orders table indexes
        Schema::table('orders', function (Blueprint $table) {
            $table->index('user_id', 'orders_user_id_index');
            $table->index('status', 'orders_status_index');
            $table->index('payment_status', 'orders_payment_status_index');
            $table->index('created_at', 'orders_created_at_index');
            // Composite: status + created — for admin dashboard filtering
            $table->index(['status', 'created_at'], 'orders_status_created_index');
        });

        // Order items table indexes
        Schema::table('order_items', function (Blueprint $table) {
            $table->index('order_id', 'order_items_order_id_index');
            $table->index('product_id', 'order_items_product_id_index');
        });

        // Reviews table indexes
        Schema::table('reviews', function (Blueprint $table) {
            $table->index('product_id', 'reviews_product_id_index');
            $table->index('user_id', 'reviews_user_id_index');
            // Composite: for average rating queries per product
            $table->index(['product_id', 'rating'], 'reviews_product_rating_index');
        });

        // Categories table indexes
        Schema::table('categories', function (Blueprint $table) {
            $table->index('slug', 'categories_slug_index');
            $table->index('is_active', 'categories_is_active_index');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex('products_category_id_index');
            $table->dropIndex('products_is_active_index');
            $table->dropIndex('products_slug_index');
            $table->dropIndex('products_sku_index');
            $table->dropIndex('products_category_active_index');
            $table->dropIndex('products_active_created_index');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex('orders_user_id_index');
            $table->dropIndex('orders_status_index');
            $table->dropIndex('orders_payment_status_index');
            $table->dropIndex('orders_created_at_index');
            $table->dropIndex('orders_status_created_index');
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->dropIndex('order_items_order_id_index');
            $table->dropIndex('order_items_product_id_index');
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->dropIndex('reviews_product_id_index');
            $table->dropIndex('reviews_user_id_index');
            $table->dropIndex('reviews_product_rating_index');
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->dropIndex('categories_slug_index');
            $table->dropIndex('categories_is_active_index');
        });
    }
};
