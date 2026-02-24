<?php

namespace Tests\Feature\Products;

use Tests\TestCase;
use App\Models\Product;
use App\Models\Category;

class ProductListTest extends TestCase
{
    public function test_can_list_all_products(): void
    {
        Product::factory()->count(10)->create();

        $response = $this->getJson('/api/products');

        $response->assertStatus(200)
            ->assertJsonStructure([
            'success',
            'data' => [
                'data' => [
                    '*' => ['id', 'name', 'price', 'stock', 'is_active'],
                ],
                'current_page',
                'per_page',
                'total',
            ],
        ]);
    }

    public function test_can_filter_products_by_category(): void
    {
        $category = Category::factory()->create();
        Product::factory()->count(5)->create(['category_id' => $category->id]);
        Product::factory()->count(3)->create(); // different category

        $response = $this->getJson('/api/products?category_id=' . $category->id);

        $response->assertStatus(200);
        $data = $response->json('data.data');

        $this->assertCount(5, $data);
        foreach ($data as $product) {
            $this->assertEquals($category->id, $product['category_id']);
        }
    }

    public function test_can_view_single_product(): void
    {
        $product = Product::factory()->create();

        $response = $this->getJson("/api/products/{$product->id}");

        $response->assertStatus(200)
            ->assertJson([
            'success' => true,
            'data' => [
                'id' => $product->id,
                'name' => $product->name,
            ],
        ]);
    }
}
