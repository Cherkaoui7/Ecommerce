<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = ['category_id', 'name', 'slug', 'description', 'price', 'old_price', 'stock', 'is_active', 'sku', 'image_url'];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
