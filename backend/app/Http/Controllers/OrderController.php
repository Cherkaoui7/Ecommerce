<?php

namespace App\Http\Controllers;

use App\Mail\OrderConfirmationMail;
use App\Mail\OrderStatusChangedMail;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Notifications\LowStockNotification;
use App\Notifications\OrderPlacedNotification;
use App\Notifications\OrderStatusNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user() && $request->user()->role === 'admin') {
            // Eager load relationships to prevent N+1.
            $orders = Order::with(['items.product', 'user'])
                ->orderBy('created_at', 'desc')
                ->get();
        } else {
            $orders = Order::with(['items.product'])
                ->where('user_id', $request->user()->id)
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return response()->json(['success' => true, 'data' => $orders]);
    }

    public function show(Request $request, Order $order)
    {
        if ($request->user() && $request->user()->role !== 'admin' && $order->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorise.',
                'errors' => ['authorization' => ['Permissions insuffisantes.']],
            ], 403);
        }

        $order->load(['items.product', 'user']);

        return response()->json(['success' => true, 'data' => $order]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'products' => 'required|array|min:1',
            'products.*.id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
            'shipping_address' => 'required|array|min:1',
            'billing_address' => 'required|array|min:1',
            'payment_method' => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {
            $productLines = collect($validated['products']);
            $requestedByProduct = $productLines
                ->groupBy('id')
                ->map(fn($items) => (int) $items->sum('quantity'));

            $productIds = $requestedByProduct->keys()->all();

            $products = Product::whereIn('id', $productIds)
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            $missingIds = array_diff($productIds, $products->keys()->all());
            if (!empty($missingIds)) {
                throw ValidationException::withMessages([
                    'products' => ['Un ou plusieurs produits sont indisponibles.'],
                ]);
            }

            foreach ($requestedByProduct as $productId => $requestedQuantity) {
                $product = $products->get((int) $productId);

                if (!$product || !$product->is_active || (int) $product->stock < (int) $requestedQuantity) {
                    $productName = $product?->name ?? "ID {$productId}";

                    throw ValidationException::withMessages([
                        'products' => ["Stock insuffisant pour le produit {$productName}."],
                    ]);
                }
            }

            $total = 0.0;
            foreach ($productLines as $line) {
                $product = $products->get((int) $line['id']);
                $unitPrice = (float) $product->price;
                $total += $unitPrice * (int) $line['quantity'];
            }

            $order = Order::create([
                'user_id' => $request->user()->id,
                'status' => 'pending',
                'total' => round($total, 2),
                'payment_method' => $validated['payment_method'] ?? 'stripe',
                'payment_status' => 'pending',
                'shipping_address_json' => json_encode($validated['shipping_address']),
                'billing_address_json' => json_encode($validated['billing_address']),
            ]);

            foreach ($productLines as $line) {
                $product = $products->get((int) $line['id']);
                $quantity = (int) $line['quantity'];
                $unitPrice = (float) $product->price;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_name_snapshot' => $product->name,
                    'unit_price' => $unitPrice,
                    'quantity' => $quantity,
                    'line_total' => $unitPrice * $quantity,
                ]);
            }

            $admins = User::where('role', 'admin')->get();

            foreach ($requestedByProduct as $productId => $requestedQuantity) {
                $product = $products->get((int) $productId);
                $product->stock = (int) $product->stock - (int) $requestedQuantity;
                $product->save();

                if ($product->stock <= 10 && $product->stock > 0) {
                    foreach ($admins as $admin) {
                        $admin->notify(new LowStockNotification($product, $product->stock));
                    }
                } elseif ($product->stock === 0) {
                    foreach ($admins as $admin) {
                        $admin->notify(new LowStockNotification($product, 0));
                    }
                }
            }

            DB::commit();

            $request->user()->notify(new OrderPlacedNotification($order));
            Mail::to($request->user()->email)->send(new OrderConfirmationMail($order));

            $order->load(['items.product']);

            return response()->json(['success' => true, 'data' => $order], 201);
        } catch (ValidationException $e) {
            DB::rollBack();
            throw $e;
        } catch (\Throwable $e) {
            DB::rollBack();

            Log::error('Order creation failed', [
                'user_id' => $request->user()?->id,
                'exception' => $e,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la creation de la commande.',
            ], 500);
        }
    }

    public function update(Request $request, Order $order)
    {
        if ($request->user() && $request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Non autorise.',
                'errors' => ['authorization' => ['Permissions insuffisantes.']],
            ], 403);
        }

        $validated = $request->validate([
            'status' => 'string|in:pending,paid,processing,shipped,completed,cancelled',
            'payment_status' => 'string',
        ]);

        $oldStatus = $order->status;

        $order->update($validated);

        if (isset($validated['status']) && $oldStatus !== $validated['status']) {
            $user = User::find($order->user_id);

            if ($user) {
                $user->notify(new OrderStatusNotification($order, $oldStatus));
                Mail::to($user->email)->send(new OrderStatusChangedMail($order, $oldStatus));
            }
        }

        return response()->json(['success' => true, 'data' => $order]);
    }
}
