<?php

namespace App\Http\Controllers;

use App\Models\ProductHistory;
use Illuminate\Http\Request;

class ProductHistoryController extends Controller
{
    public function index(Request $request)
    {
        $query = ProductHistory::with(['product:id,name,image_url', 'user:id,name'])
            ->orderBy('created_at', 'desc');

        // Filtres optionnels
        if ($request->has('action')) {
            $query->where('action', $request->action);
        }

        if ($request->has('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        if ($request->has('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $history = $query->paginate(50);

        // Statistiques
        $stats = [
            'total' => ProductHistory::count(),
            'today' => ProductHistory::whereDate('created_at', today())->count(),
            'this_week' => ProductHistory::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $history,
            'stats' => $stats,
        ]);
    }
}
