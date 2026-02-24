<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration 
{
    public function up(): void
    {
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('type'); // percentage, fixed, free_shipping
            $table->decimal('value', 10, 2); // Montant ou pourcentage
            $table->decimal('min_purchase', 10, 2)->nullable(); // Montant minimum d'achat
            $table->decimal('max_discount', 10, 2)->nullable(); // Réduction maximum
            $table->integer('usage_limit')->nullable(); // Nombre d'utilisations max
            $table->integer('usage_count')->default(0); // Nombre d'utilisations actuelles
            $table->integer('per_user_limit')->nullable(); // Limite par utilisateur
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->json('applicable_categories')->nullable(); // IDs des catégories
            $table->json('applicable_products')->nullable(); // IDs des produits
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Table pivot pour suivre l'utilisation par utilisateur
        Schema::create('coupon_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('coupon_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->timestamp('used_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coupon_user');
        Schema::dropIfExists('coupons');
    }
};
