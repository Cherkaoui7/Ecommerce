<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    /**
     * Generate and download invoice PDF for an order.
     */
    public function downloadInvoice(Request $request, $orderId)
    {
        $order = Order::with(['items', 'user'])->findOrFail($orderId);

        // Verify user owns this order.
        if ($order->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Non autorise.',
                'errors' => ['authorization' => ['Permissions insuffisantes.']],
            ], 403);
        }

        $data = [
            'order' => $order,
            'user' => $order->user,
            'items' => $order->items,
            'shipping_address' => $order->shipping_address,
            'billing_address' => $order->billing_address,
            'subtotal' => $order->items->sum('line_total'),
            'tax' => 0,
            'shipping' => 0,
            'total' => $order->total,
        ];

        $pdf = Pdf::loadView('invoices.invoice', $data);

        return $pdf->download('facture-' . $order->id . '.pdf');
    }

    /**
     * Preview invoice in browser.
     */
    public function previewInvoice(Request $request, $orderId)
    {
        $order = Order::with(['items', 'user'])->findOrFail($orderId);

        // Verify user owns this order.
        if ($order->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Non autorise.',
                'errors' => ['authorization' => ['Permissions insuffisantes.']],
            ], 403);
        }

        $data = [
            'order' => $order,
            'user' => $order->user,
            'items' => $order->items,
            'shipping_address' => $order->shipping_address,
            'billing_address' => $order->billing_address,
            'subtotal' => $order->items->sum('line_total'),
            'tax' => 0,
            'shipping' => 0,
            'total' => $order->total,
        ];

        $pdf = Pdf::loadView('invoices.invoice', $data);

        return $pdf->stream('facture-' . $order->id . '.pdf');
    }
}
