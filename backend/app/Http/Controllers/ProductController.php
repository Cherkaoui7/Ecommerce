<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductHistory;
use App\Services\CacheService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $categoryId = $request->get('category_id');
        $isActive = $request->has('is_active') ? $request->boolean('is_active') : null;

        $cacheKey = CacheService::productsKey($categoryId ? (int) $categoryId : null, $isActive);

        $products = CacheService::rememberProductsList($cacheKey, function () use ($categoryId, $isActive) {
            $query = Product::with('category')
                ->orderByDesc('created_at')
                ->orderByDesc('id');

            if ($categoryId) {
                $query->where('category_id', $categoryId);
            }

            if ($isActive !== null) {
                $query->where('is_active', $isActive);
            }

            return $query->paginate(15);
        });

        return response()->json(['success' => true, 'data' => $products]);
    }

    public function show(Product $product)
    {
        $productData = CacheService::rememberProductDetail((int) $product->id, function () use ($product) {
            return $product->load('category');
        });

        return response()->json(['success' => true, 'data' => $productData]);
    }

    public function store(Request $request)
    {
        if ($request->user() && $request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Non autorise.',
                'errors' => ['authorization' => ['Permissions insuffisantes.']],
            ], 403);
        }

        if (!$request->has('slug')) {
            $request->merge(['slug' => Str::slug((string) $request->name)]);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:products',
            'category_id' => 'nullable|exists:categories,id',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'old_price' => 'nullable|numeric|min:0',
            'stock' => 'integer|min:0',
            'is_active' => 'boolean',
            'sku' => 'nullable|string|unique:products',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $validated['image_url'] = url('/storage/' . $path);
        }

        $product = Product::create($validated);

        ProductHistory::create([
            'product_id' => $product->id,
            'user_id' => $request->user()->id ?? null,
            'action' => 'created',
            'new_values' => $product->toArray(),
            'description' => 'Produit cree',
        ]);

        CacheService::clearProductCaches();

        return response()->json(['success' => true, 'data' => $product], 201);
    }

    public function update(Request $request, Product $product)
    {
        if ($request->user() && $request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Non autorise.',
                'errors' => ['authorization' => ['Permissions insuffisantes.']],
            ], 403);
        }

        if (!$request->has('slug') && $request->has('name')) {
            $request->merge(['slug' => Str::slug((string) $request->name)]);
        }

        $validated = $request->validate([
            'name' => 'string|max:255',
            'slug' => 'string|unique:products,slug,' . $product->id,
            'category_id' => 'nullable|exists:categories,id',
            'description' => 'nullable|string',
            'price' => 'numeric|min:0',
            'old_price' => 'nullable|numeric|min:0',
            'stock' => 'integer|min:0',
            'is_active' => 'boolean',
            'sku' => 'nullable|string|unique:products,sku,' . $product->id,
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $validated['image_url'] = url('/storage/' . $path);
        }

        $oldValues = $product->toArray();
        $product->update($validated);

        ProductHistory::create([
            'product_id' => $product->id,
            'user_id' => $request->user()->id ?? null,
            'action' => 'updated',
            'old_values' => $oldValues,
            'new_values' => $product->fresh()->toArray(),
            'description' => 'Produit mis a jour',
        ]);

        CacheService::clearProductCaches($product->id);

        return response()->json(['success' => true, 'data' => $product]);
    }

    public function bulkUpdate(Request $request)
    {
        if ($request->user() && $request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Non autorise.',
                'errors' => ['authorization' => ['Permissions insuffisantes.']],
            ], 403);
        }

        $validated = $request->validate([
            'product_ids' => 'required|array|min:1',
            'product_ids.*' => 'integer|exists:products,id',
            'price' => 'nullable|numeric|min:0',
            'stock_action' => 'nullable|in:set,add,subtract',
            'stock_value' => 'nullable|integer|min:0',
            'category_id' => 'nullable|exists:categories,id',
            'is_active' => 'nullable|boolean',
        ]);

        $products = Product::whereIn('id', $validated['product_ids'])->get();
        $updatedCount = 0;

        foreach ($products as $product) {
            $oldValues = $product->toArray();
            $changes = [];

            if (isset($validated['price'])) {
                $changes['price'] = $validated['price'];
            }

            if (isset($validated['stock_action']) && isset($validated['stock_value'])) {
                $changes['stock'] = match ($validated['stock_action']) {
                    'set' => $validated['stock_value'],
                    'add' => $product->stock + $validated['stock_value'],
                    'subtract' => max(0, $product->stock - $validated['stock_value']),
                };
            }

            if (array_key_exists('category_id', $validated)) {
                $changes['category_id'] = $validated['category_id'];
            }

            if (isset($validated['is_active'])) {
                $changes['is_active'] = $validated['is_active'];
            }

            if (!empty($changes)) {
                $product->update($changes);

                ProductHistory::create([
                    'product_id' => $product->id,
                    'user_id' => $request->user()->id ?? null,
                    'action' => 'bulk_update',
                    'old_values' => $oldValues,
                    'new_values' => $product->fresh()->toArray(),
                    'description' => 'Mise a jour en masse : ' . implode(', ', array_keys($changes)),
                ]);

                $updatedCount++;
            }
        }

        CacheService::clearProductCaches();

        return response()->json([
            'success' => true,
            'message' => "{$updatedCount} produit(s) mis a jour.",
            'updated' => $updatedCount,
        ]);
    }

    public function destroy(Request $request, Product $product)
    {
        if ($request->user() && $request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Non autorise.',
                'errors' => ['authorization' => ['Permissions insuffisantes.']],
            ], 403);
        }

        ProductHistory::create([
            'product_id' => $product->id,
            'user_id' => $request->user()->id ?? null,
            'action' => 'deleted',
            'old_values' => $product->toArray(),
            'description' => 'Produit supprime',
        ]);

        $productId = $product->id;
        $product->delete();

        CacheService::clearProductCaches($productId);

        return response()->json(['success' => true, 'message' => 'Produit supprime.']);
    }
}
