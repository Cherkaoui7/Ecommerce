<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    // Lister tous les coupons (admin)
    public function index()
    {
        $coupons = Coupon::orderBy('created_at', 'desc')->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $coupons
        ]);
    }

    // Créer un coupon (admin)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:coupons,code|max:50',
            'type' => 'required|in:percentage,fixed,free_shipping',
            'value' => 'required|numeric|min:0',
            'min_purchase' => 'nullable|numeric|min:0',
            'max_discount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'per_user_limit' => 'nullable|integer|min:1',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after:starts_at',
            'is_active' => 'boolean',
            'applicable_categories' => 'nullable|array',
            'applicable_products' => 'nullable|array',
            'description' => 'nullable|string|max:500'
        ]);

        $coupon = Coupon::create($validated);

        return response()->json([
            'success' => true,
            'data' => $coupon,
            'message' => 'Code promo créé avec succès.'
        ], 201);
    }

    // Valider un code promo
    public function validate(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'cart_total' => 'required|numeric|min:0',
            'cart_items' => 'nullable|array'
        ]);

        $coupon = Coupon::where('code', strtoupper($request->code))->first();

        if (!$coupon) {
            return response()->json([
                'success' => false,
                'message' => 'Code promo invalide.'
            ], 404);
        }

        // Vérifier la validité du coupon
        $validity = $coupon->isValid();
        if (!$validity['valid']) {
            return response()->json([
                'success' => false,
                'message' => $validity['message']
            ], 400);
        }

        // Vérifier si l'utilisateur peut l'utiliser
        if ($request->user() && !$coupon->canBeUsedBy($request->user()->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Vous avez atteint la limite d\'utilisation de ce code promo.'
            ], 400);
        }

        // Calculer la réduction
        $result = $coupon->calculateDiscount($request->cart_total, $request->cart_items ?? []);

        if (isset($result['error'])) {
            return response()->json([
                'success' => false,
                'message' => $result['error']
            ], 400);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'coupon' => $coupon,
                'discount' => $result['discount'],
                'type' => $result['type'],
                'new_total' => max(0, $request->cart_total - $result['discount'])
            ],
            'message' => 'Code promo appliqué !'
        ]);
    }

    // Mettre à jour un coupon (admin)
    public function update(Request $request, $id)
    {
        $coupon = Coupon::findOrFail($id);

        $validated = $request->validate([
            'code' => 'sometimes|string|unique:coupons,code,' . $id . '|max:50',
            'type' => 'sometimes|in:percentage,fixed,free_shipping',
            'value' => 'sometimes|numeric|min:0',
            'min_purchase' => 'nullable|numeric|min:0',
            'max_discount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'per_user_limit' => 'nullable|integer|min:1',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date',
            'is_active' => 'boolean',
            'applicable_categories' => 'nullable|array',
            'applicable_products' => 'nullable|array',
            'description' => 'nullable|string|max:500'
        ]);

        $coupon->update($validated);

        return response()->json([
            'success' => true,
            'data' => $coupon,
            'message' => 'Code promo mis à jour.'
        ]);
    }

    // Supprimer un coupon (admin)
    public function destroy($id)
    {
        $coupon = Coupon::findOrFail($id);
        $coupon->delete();

        return response()->json([
            'success' => true,
            'message' => 'Code promo supprimé.'
        ]);
    }

    // Obtenir un coupon par son code
    public function show($code)
    {
        $coupon = Coupon::where('code', strtoupper($code))->first();

        if (!$coupon) {
            return response()->json([
                'success' => false,
                'message' => 'Code promo introuvable.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $coupon
        ]);
    }
}
