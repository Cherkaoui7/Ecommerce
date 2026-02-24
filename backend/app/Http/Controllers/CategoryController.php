<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Services\CacheService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = CacheService::rememberCategories(
            fn() => Category::where('is_active', true)->get()
        );

        return response()->json(['success' => true, 'data' => $categories]);
    }

    public function show(Category $category)
    {
        return response()->json(['success' => true, 'data' => $category]);
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

        if (!$request->has('slug') && $request->filled('name')) {
            $request->merge(['slug' => Str::slug((string) $request->name)]);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:categories',
            'parent_id' => 'nullable|exists:categories,id',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $category = Category::create($validated);
        CacheService::clearCategoryCaches();

        return response()->json(['success' => true, 'data' => $category], 201);
    }

    public function update(Request $request, Category $category)
    {
        if ($request->user() && $request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Non autorise.',
                'errors' => ['authorization' => ['Permissions insuffisantes.']],
            ], 403);
        }

        if (!$request->has('slug') && $request->filled('name')) {
            $request->merge(['slug' => Str::slug((string) $request->name)]);
        }

        $validated = $request->validate([
            'name' => 'string|max:255',
            'slug' => 'string|unique:categories,slug,' . $category->id,
            'parent_id' => 'nullable|exists:categories,id',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $category->update($validated);
        CacheService::clearCategoryCaches();

        return response()->json(['success' => true, 'data' => $category]);
    }

    public function destroy(Request $request, Category $category)
    {
        if ($request->user() && $request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Non autorise.',
                'errors' => ['authorization' => ['Permissions insuffisantes.']],
            ], 403);
        }

        $category->delete();
        CacheService::clearCategoryCaches();

        return response()->json(['success' => true, 'message' => 'Categorie supprimee.']);
    }
}
