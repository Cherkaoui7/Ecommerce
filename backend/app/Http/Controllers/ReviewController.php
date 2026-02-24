<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    // List reviews for a product.
    public function index(Request $request, $productId)
    {
        $reviews = Review::where('product_id', $productId)
            ->approved()
            ->with('user:id,name')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        Product::findOrFail($productId);

        $allReviews = Review::where('product_id', $productId)->approved();

        $stats = [
            'average_rating' => round($allReviews->avg('rating') ?? 0, 1),
            'total_reviews' => $allReviews->count(),
            'rating_distribution' => [
                5 => Review::where('product_id', $productId)->approved()->where('rating', 5)->count(),
                4 => Review::where('product_id', $productId)->approved()->where('rating', 4)->count(),
                3 => Review::where('product_id', $productId)->approved()->where('rating', 3)->count(),
                2 => Review::where('product_id', $productId)->approved()->where('rating', 2)->count(),
                1 => Review::where('product_id', $productId)->approved()->where('rating', 1)->count(),
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => $reviews,
            'stats' => $stats,
        ]);
    }

    // Create review.
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'comment' => 'nullable|string|max:1000',
            'images' => 'nullable|array|max:5',
            'images.*' => 'url',
            'order_id' => 'nullable|exists:orders,id',
        ]);

        $existing = Review::where('product_id', $validated['product_id'])
            ->where('user_id', $request->user()->id)
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'Vous avez deja laisse un avis pour ce produit.',
                'errors' => ['review' => ['Avis deja existant pour ce produit.']],
            ], 400);
        }

        $verifiedPurchase = false;
        if (isset($validated['order_id'])) {
            $order = \App\Models\Order::where('id', $validated['order_id'])
                ->where('user_id', $request->user()->id)
                ->first();

            if ($order) {
                $verifiedPurchase = $order->items()->where('product_id', $validated['product_id'])->exists();
            }
        }

        $review = Review::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'verified_purchase' => $verifiedPurchase,
            'is_approved' => true,
        ]);

        return response()->json([
            'success' => true,
            'data' => $review,
            'message' => 'Merci pour votre avis !',
        ], 201);
    }

    // Update review.
    public function update(Request $request, $id)
    {
        $review = Review::findOrFail($id);

        if ($review->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorise.',
                'errors' => ['authorization' => ['Permissions insuffisantes.']],
            ], 403);
        }

        $validated = $request->validate([
            'rating' => 'sometimes|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'comment' => 'nullable|string|max:1000',
            'images' => 'nullable|array|max:5',
            'images.*' => 'url',
        ]);

        $review->update($validated);

        return response()->json([
            'success' => true,
            'data' => $review,
            'message' => 'Avis mis a jour.',
        ]);
    }

    // Delete review.
    public function destroy(Request $request, $id)
    {
        $review = Review::findOrFail($id);

        if ($review->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Non autorise.',
                'errors' => ['authorization' => ['Permissions insuffisantes.']],
            ], 403);
        }

        $review->delete();

        return response()->json([
            'success' => true,
            'message' => 'Avis supprime.',
        ]);
    }

    // Mark review as helpful.
    public function markHelpful($productId, $reviewId)
    {
        $review = Review::findOrFail($reviewId);
        $review->increment('helpful_count');

        return response()->json([
            'success' => true,
            'helpful_count' => $review->helpful_count,
        ]);
    }
}
