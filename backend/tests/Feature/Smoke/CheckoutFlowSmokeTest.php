<?php

namespace Tests\Feature\Smoke;

use App\Models\Product;
use Illuminate\Support\Str;
use Tests\TestCase;

class CheckoutFlowSmokeTest extends TestCase
{
    public function test_login_browse_checkout_smoke_flow(): void
    {
        $product = Product::factory()->create([
            'price' => 149.99,
            'stock' => 12,
            'is_active' => true,
        ]);

        $password = 'StrongPass1!';
        $email = 'smoke+' . Str::random(8) . '@example.test';

        $registerResponse = $this->postJson('/api/auth/register', [
            'name' => 'Smoke User',
            'email' => $email,
            'password' => $password,
            'password_confirmation' => $password,
        ]);

        $registerResponse->assertCreated()
            ->assertJsonPath('success', true);

        $token = (string) $registerResponse->json('access_token');
        $this->assertNotEmpty($token);

        $this->withToken($token)
            ->getJson('/api/products')
            ->assertOk()
            ->assertJsonPath('success', true);

        $checkoutResponse = $this->withToken($token)
            ->postJson('/api/orders', [
                'products' => [
                    [
                        'id' => $product->id,
                        'quantity' => 2,
                        'price' => 149.99,
                    ],
                ],
                'shipping_address' => [
                    'fullName' => 'Smoke User',
                    'address' => '10 Main Street',
                    'city' => 'Paris',
                    'zipCode' => '75001',
                    'country' => 'France',
                ],
                'billing_address' => [
                    'fullName' => 'Smoke User',
                    'address' => '10 Main Street',
                    'city' => 'Paris',
                    'zipCode' => '75001',
                    'country' => 'France',
                ],
                'payment_method' => 'credit_card',
            ]);

        $checkoutResponse->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.status', 'pending');

        $this->withToken($token)
            ->getJson('/api/orders')
            ->assertOk()
            ->assertJsonPath('success', true);
    }
}

