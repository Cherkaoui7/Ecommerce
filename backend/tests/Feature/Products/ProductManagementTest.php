<?php

namespace Tests\Feature\Products;

use Tests\TestCase;
use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Facades\Storage;

class ProductManagementTest extends TestCase
{
    private User $admin;
    private User $customer;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->customer = User::factory()->create(['role' => 'customer']);
    }

    public function test_admin_can_create_product(): void
    {
        Storage::fake('public');
        $category = Category::factory()->create();

        $response = $this->actingAs($this->admin)
            ->postJson('/api/products', [
            'name' => 'New Product',
            'category_id' => $category->id,
            'description' => 'Product description',
            'price' => 99.99,
            'stock' => 50,
            'is_active' => true,
            'sku' => 'TEST-001',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
            'success',
            'data' => ['id', 'name', 'slug', 'price'],
        ]);

        $this->assertDatabaseHas('products', [
            'name' => 'New Product',
            'sku' => 'TEST-001',
        ]);
    }

    public function test_customer_cannot_create_product(): void
    {
        $category = Category::factory()->create();

        $response = $this->actingAs($this->customer)
            ->postJson('/api/products', [
            'name' => 'New Product',
            'category_id' => $category->id,
            'price' => 99.99,
        ]);

        $response->assertStatus(403);
    }

    public function test_admin_can_update_product(): void
    {
        $product = Product::factory()->create(['price' => 100]);

        $response = $this->actingAs($this->admin)
            ->putJson("/api/products/{$product->id}", [
            'price' => 150,
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'price' => 150,
        ]);
    }

    public function test_admin_can_delete_product(): void
    {
        $product = Product::factory()->create();

        $response = $this->actingAs($this->admin)
            ->deleteJson("/api/products/{$product->id}");

        $response->assertStatus(200);

        $this->assertDatabaseMissing('products', [
            'id' => $product->id,
        ]);
    }
}
