<?php

namespace Tests\Feature\Orders;

use Tests\TestCase;
use App\Models\User;
use App\Models\Product;
use Illuminate\Support\Facades\Notification;
use App\Notifications\OrderPlacedNotification;

class OrderCreationTest extends TestCase
{
    private User $customer;

    private array $validAddress = [
        'street' => '123 Main St',
        'city' => 'Paris',
        'postal_code' => '75001',
        'country' => 'France',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->customer = User::factory()->create(['role' => 'customer']);
    }

    public function test_customer_can_create_order(): void
    {
        Notification::fake();

        $product = Product::factory()->create([
            'price' => 100,
            'stock' => 50,
        ]);

        $response = $this->actingAs($this->customer)
            ->postJson('/api/orders', [
            'products' => [
                [
                    'id' => $product->id,
                    'quantity' => 2,
                    'price' => 100,
                ],
            ],
            'shipping_address' => $this->validAddress,
            'billing_address' => $this->validAddress,
            'payment_method' => 'stripe',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
            'success',
            'data' => ['id', 'total', 'status', 'items'],
        ]);

        $this->assertDatabaseHas('orders', [
            'user_id' => $this->customer->id,
            'total' => 200,
            'status' => 'pending',
        ]);

        Notification::assertSentTo($this->customer, OrderPlacedNotification::class);
    }

    public function test_order_decrements_product_stock(): void
    {
        $product = Product::factory()->create([
            'price' => 100,
            'stock' => 50,
        ]);

        $this->actingAs($this->customer)
            ->postJson('/api/orders', [
            'products' => [
                [
                    'id' => $product->id,
                    'quantity' => 5,
                    'price' => 100,
                ],
            ],
            'shipping_address' => $this->validAddress,
            'billing_address' => $this->validAddress,
        ]);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'stock' => 45,
        ]);
    }

    public function test_order_validation_fails_with_invalid_data(): void
    {
        $response = $this->actingAs($this->customer)
            ->postJson('/api/orders', [
            'products' => [],
            'shipping_address' => [],
            'billing_address' => [],
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['products', 'shipping_address', 'billing_address']);
    }

    public function test_unauthenticated_user_cannot_create_order(): void
    {
        $response = $this->postJson('/api/orders', [
            'products' => [],
            'shipping_address' => $this->validAddress,
            'billing_address' => $this->validAddress,
        ]);

        $response->assertStatus(401);
    }
}
