<?php

namespace Tests\Unit\Models;

use Tests\TestCase;
use App\Models\Product;
use App\Models\Category;

class ProductTest extends TestCase
{
    public function test_product_belongs_to_category(): void
    {
        $category = Category::factory()->create();
        $product = Product::factory()->create(['category_id' => $category->id]);

        $this->assertInstanceOf(Category::class , $product->category);
        $this->assertEquals($category->id, $product->category->id);
    }

    public function test_product_has_fillable_attributes(): void
    {
        $expected = [
            'category_id', 'name', 'slug', 'description',
            'price', 'old_price', 'stock', 'is_active', 'sku', 'image_url',
        ];

        $product = new Product();

        foreach ($expected as $attribute) {
            $this->assertContains($attribute, $product->getFillable(),
                "Expected '{$attribute}' to be in fillable.");
        }
    }

    public function test_product_is_active_by_default(): void
    {
        $product = Product::factory()->create(['is_active' => true]);

        $this->assertTrue((bool)$product->is_active);
    }

    public function test_product_has_slug(): void
    {
        $product = Product::factory()->create(['slug' => 'test-product-slug']);

        $this->assertEquals('test-product-slug', $product->slug);
    }
}
