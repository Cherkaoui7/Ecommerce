<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    public function definition(): array
    {
        $address = json_encode([
            'street' => fake()->streetAddress(),
            'city' => fake()->city(),
            'postal_code' => fake()->postcode(),
            'country' => 'France',
        ]);

        return [
            'user_id' => User::factory(),
            'status' => fake()->randomElement(['pending', 'paid', 'processing', 'shipped', 'completed']),
            'total' => fake()->randomFloat(2, 50, 5000),
            'payment_method' => 'stripe',
            'payment_status' => 'pending',
            'shipping_address_json' => $address,
            'billing_address_json' => $address,
        ];
    }
}
