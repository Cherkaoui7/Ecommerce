<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        return [
            'category_id' => Category::factory(),
            'name' => fake()->words(3, true),
            'slug' => fake()->unique()->slug(),
            'description' => fake()->paragraph(),
            'price' => fake()->randomFloat(2, 10, 1000),
            'old_price' => fake()->optional()->randomFloat(2, 20, 1200),
            'stock' => fake()->numberBetween(0, 200),
            'is_active' => true,
            'sku' => strtoupper(fake()->unique()->bothify('???-####')),
            'image_url' => fake()->imageUrl(640, 480, 'product'),
        ];
    }
}
