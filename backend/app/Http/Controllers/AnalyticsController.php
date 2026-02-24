<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    /**
     * Get dashboard analytics for admin.
     */
    public function dashboard(Request $request)
    {
        [$period, $startDate, $bucketExpression] = $this->resolvePeriod($request->get('period', 'month'));

        $totalSales = Order::where(function ($q) {
            $q->where('payment_status', 'paid')
              ->orWhere('status', 'completed');
        })->sum('total');

        $totalOrders = Order::count();
        $totalCustomers = User::where('role', 'customer')->count();
        $activeProducts = Product::where('is_active', true)->count();

        $recentOrdersCount = Order::where('created_at', '>=', $startDate)->count();
        $recentRevenue = Order::where('created_at', '>=', $startDate)
            ->where(function ($q) {
                $q->where('payment_status', 'paid')
                  ->orWhere('status', 'completed');
            })
            ->sum('total');

        $newCustomers = User::where('role', 'customer')
            ->where('created_at', '>=', $startDate)
            ->count();

        $topProducts = OrderItem::select('product_id', DB::raw('SUM(quantity) as total_sold'))
            ->whereHas('order', fn ($q) => $q->where('created_at', '>=', $startDate))
            ->groupBy('product_id')
            ->orderByDesc('total_sold')
            ->limit(5)
            ->with('product:id,name')
            ->get()
            ->map(function ($item) {
                return [
                    'product' => $item->product,
                    'total_sold' => (int) $item->total_sold,
                ];
            })
            ->values();

        $revenueByBucket = Order::where('created_at', '>=', $startDate)
            ->where(function ($q) {
                $q->where('payment_status', 'paid')
                  ->orWhere('status', 'completed');
            })
            ->select(
                DB::raw("{$bucketExpression} as bucket"),
                DB::raw('SUM(total) as revenue'),
                DB::raw('COUNT(*) as orders')
            )
            ->groupBy('bucket')
            ->orderBy('bucket', 'asc')
            ->get();

        $statusDistribution = Order::where('created_at', '>=', $startDate)
            ->select('status', DB::raw('COUNT(*) as total'))
            ->groupBy('status')
            ->orderBy('status')
            ->get();

        $recentOrders = Order::select('id', 'total', 'status', 'created_at')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        $conversionRate = $totalOrders > 0
            ? round((Order::whereIn('status', ['completed', 'shipped'])->count() / $totalOrders) * 100, 2)
            : 0;

        $averageOrderValue = $totalOrders > 0
            ? round((float) $totalSales / $totalOrders, 2)
            : 0;

        $lowStockCount = Product::where('is_active', true)
            ->where('stock', '<=', 10)
            ->count();

        return response()->json([
            'success' => true,
            'data' => [
                'period' => $period,
                'overview' => [
                    'total_sales' => round((float) $totalSales, 2),
                    'total_orders' => $totalOrders,
                    'total_customers' => $totalCustomers,
                    'active_products' => $activeProducts,
                    'new_customers' => $newCustomers,
                    'recent_orders' => $recentOrdersCount,
                    'recent_revenue' => round((float) $recentRevenue, 2),
                    'conversion_rate' => $conversionRate,
                    'average_order_value' => $averageOrderValue,
                    'low_stock_alerts' => $lowStockCount,
                ],
                // Backward-compatible keys used by existing admin screens.
                'top_products' => $topProducts,
                'daily_revenue' => $revenueByBucket->map(function ($row) {
                    return [
                        'date' => $row->bucket,
                        'revenue' => (float) $row->revenue,
                        'orders' => (int) $row->orders,
                    ];
                })->values(),
                // New chart-ready payload to avoid frontend hardcoded values.
                'charts' => [
                    'revenue' => [
                        'labels' => $revenueByBucket->pluck('bucket')->values(),
                        'values' => $revenueByBucket->map(fn ($row) => (float) $row->revenue)->values(),
                    ],
                    'top_products' => [
                        'labels' => $topProducts->map(fn ($row) => $row['product']?->name ?? 'Unknown')->values(),
                        'values' => $topProducts->map(fn ($row) => (int) $row['total_sold'])->values(),
                    ],
                    'status_distribution' => [
                        'labels' => $statusDistribution->pluck('status')->values(),
                        'values' => $statusDistribution->map(fn ($row) => (int) $row->total)->values(),
                    ],
                ],
                'recent_orders_list' => $recentOrders,
            ],
        ]);
    }

    /**
     * Resolve period config for dashboard charts.
     *
     * @return array{0:string,1:\Illuminate\Support\Carbon,2:string}
     */
    private function resolvePeriod(?string $period): array
    {
        $driver = DB::connection()->getDriverName();
        $monthlyBucket = $driver === 'sqlite'
            ? "strftime('%Y-%m', created_at)"
            : "DATE_FORMAT(created_at, '%Y-%m')";

        return match ($period) {
            'week' => ['week', now()->subDays(7), 'DATE(created_at)'],
            'year' => ['year', now()->subYear(), $monthlyBucket],
            default => ['month', now()->subDays(30), 'DATE(created_at)'],
        };
    }
}
