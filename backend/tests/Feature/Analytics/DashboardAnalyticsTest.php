<?php

namespace Tests\Feature\Analytics;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Tests\TestCase;

class DashboardAnalyticsTest extends TestCase
{
    public function test_dashboard_returns_chart_ready_backend_metrics(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $customer = User::factory()->create(['role' => 'customer']);

        $product = Product::factory()->create([
            'name' => 'Analytics Product',
            'price' => 100,
            'stock' => 20,
        ]);

        $order = Order::create([
            'user_id' => $customer->id,
            'status' => 'completed',
            'payment_status' => 'paid',
            'payment_method' => 'credit_card',
            'total' => 200,
            'shipping_address_json' => json_encode([
                'street' => '10 Main Street',
                'city' => 'Paris',
                'postal_code' => '75001',
                'country' => 'France',
            ]),
            'billing_address_json' => json_encode([
                'street' => '10 Main Street',
                'city' => 'Paris',
                'postal_code' => '75001',
                'country' => 'France',
            ]),
            'created_at' => now()->subDays(1),
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'product_name_snapshot' => $product->name,
            'unit_price' => 100,
            'quantity' => 2,
            'line_total' => 200,
        ]);

        $response = $this->actingAs($admin)->getJson('/api/analytics/dashboard?period=week');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.period', 'week')
            ->assertJsonStructure([
                'success',
                'data' => [
                    'overview',
                    'charts' => [
                        'revenue' => ['labels', 'values'],
                        'top_products' => ['labels', 'values'],
                        'status_distribution' => ['labels', 'values'],
                    ],
                    'recent_orders_list',
                ],
            ]);

        $payload = $response->json('data');
        $this->assertContains('Analytics Product', $payload['charts']['top_products']['labels']);
        $this->assertNotEmpty($payload['charts']['revenue']['labels']);
        $this->assertNotEmpty($payload['charts']['revenue']['values']);
    }
}
