<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = [
        'product_id',
        'user_id',
        'order_id',
        'rating',
        'title',
        'comment',
        'images',
        'verified_purchase',
        'is_approved',
        'helpful_count'
    ];

    protected $casts = [
        'images' => 'array',
        'verified_purchase' => 'boolean',
        'is_approved' => 'boolean',
        'rating' => 'integer',
        'helpful_count' => 'integer',
    ];

    protected $appends = ['user_name'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function getUserNameAttribute()
    {
        return $this->user ? $this->user->name : 'Utilisateur supprimé';
    }

    // Scope pour les avis approuvés
    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    // Scope pour les avis vérifiés
    public function scopeVerified($query)
    {
        return $query->where('verified_purchase', true);
    }
}
