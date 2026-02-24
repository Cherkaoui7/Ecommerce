<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\ProductHistoryController;

Route::prefix('auth')->group(function () {
    // Rate limit: 5 attempts per minute for login/register
    Route::middleware(['throttle:5,1'])->group(function () {
            Route::post('/register', [AuthController::class , 'register']);
            Route::post('/login', [AuthController::class , 'login']);
        }
        );

        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/user', [AuthController::class , 'user']);
            Route::post('/logout', [AuthController::class , 'logout']);
        }
        );
    });

// Public routes with general rate limiting (60/min)
Route::middleware(['throttle:60,1'])->group(function () {
    Route::get('/categories', [CategoryController::class , 'index']);
    Route::get('/categories/{category}', [CategoryController::class , 'show']);
    Route::get('/products', [ProductController::class , 'index']);
    Route::get('/products/{product}', [ProductController::class , 'show']);
});

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    // Categories admin
    Route::post('/categories', [CategoryController::class , 'store']);
    Route::put('/categories/{category}', [CategoryController::class , 'update']);
    Route::delete('/categories/{category}', [CategoryController::class , 'destroy']);

    // Products admin
    Route::post('/products', [ProductController::class , 'store']);
    Route::patch('/products/bulk', [ProductController::class , 'bulkUpdate']);
    Route::put('/products/{product}', [ProductController::class , 'update']);
    Route::delete('/products/{product}', [ProductController::class , 'destroy']);

    // Product history (separate prefix to avoid conflict with /products/{id})
    Route::get('/product-history', [ProductHistoryController::class , 'index']);
});

// Orders (authenticated users)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/orders', [OrderController::class , 'index']);
    Route::get('/orders/{order}', [OrderController::class , 'show']);
    Route::post('/orders', [OrderController::class , 'store']);

    // Invoice PDF routes
    Route::get('/orders/{order}/invoice/download', [InvoiceController::class , 'downloadInvoice']);
    Route::get('/orders/{order}/invoice/preview', [InvoiceController::class , 'previewInvoice']);
});

// Order management (admin only)
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::put('/orders/{order}', [OrderController::class , 'update']);
});

// Users management (admin only)
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/users', [UserController::class , 'index']);
    Route::get('/users/{user}', [UserController::class , 'show']);
    Route::put('/users/{user}', [UserController::class , 'update']);
});

// Reviews (avis produits)
Route::get('/products/{productId}/reviews', [ReviewController::class , 'index']);
Route::post('/products/{id}/reviews/{reviewId}/helpful', [ReviewController::class , 'markHelpful']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/reviews', [ReviewController::class , 'store']);
    Route::put('/reviews/{id}', [ReviewController::class , 'update']);
    Route::delete('/reviews/{id}', [ReviewController::class , 'destroy']);
});

// Coupons (codes promo)
Route::post('/coupons/validate', [CouponController::class , 'validate']);
Route::get('/coupons/{code}', [CouponController::class , 'show']);

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/coupons', [CouponController::class , 'index']);
    Route::post('/coupons', [CouponController::class , 'store']);
    Route::put('/coupons/{id}', [CouponController::class , 'update']);
    Route::delete('/coupons/{id}', [CouponController::class , 'destroy']);

    // Analytics routes (admin only)
    Route::get('/analytics/dashboard', [AnalyticsController::class , 'dashboard']);
});
