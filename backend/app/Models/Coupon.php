<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Coupon extends Model
{
    protected $fillable = [
        'code',
        'type',
        'value',
        'min_purchase',
        'max_discount',
        'usage_limit',
        'usage_count',
        'per_user_limit',
        'starts_at',
        'expires_at',
        'is_active',
        'applicable_categories',
        'applicable_products',
        'description'
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'min_purchase' => 'decimal:2',
        'max_discount' => 'decimal:2',
        'is_active' => 'boolean',
        'applicable_categories' => 'array',
        'applicable_products' => 'array',
        'starts_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'coupon_user')
            ->withPivot('order_id', 'used_at')
            ->withTimestamps();
    }

    // Vérifier si le coupon est valide
    public function isValid()
    {
        if (!$this->is_active) {
            return ['valid' => false, 'message' => 'Ce code promo n\'est pas actif.'];
        }

        if ($this->starts_at && Carbon::now()->lt($this->starts_at)) {
            return ['valid' => false, 'message' => 'Ce code promo n\'est pas encore valide.'];
        }

        if ($this->expires_at && Carbon::now()->gt($this->expires_at)) {
            return ['valid' => false, 'message' => 'Ce code promo a expiré.'];
        }

        if ($this->usage_limit && $this->usage_count >= $this->usage_limit) {
            return ['valid' => false, 'message' => 'Ce code promo a atteint sa limite d\'utilisation.'];
        }

        return ['valid' => true];
    }

    // Vérifier si un utilisateur peut utiliser ce coupon
    public function canBeUsedBy($userId)
    {
        if (!$this->per_user_limit) {
            return true;
        }

        $userUsageCount = $this->users()->where('user_id', $userId)->count();
        return $userUsageCount < $this->per_user_limit;
    }

    // Calculer la réduction
    public function calculateDiscount($cartTotal, $cartItems = [])
    {
        // Vérifier le montant minimum
        if ($this->min_purchase && $cartTotal < $this->min_purchase) {
            return ['discount' => 0, 'error' => "Montant minimum de {$this->min_purchase}€ requis."];
        }

        $discount = 0;

        switch ($this->type) {
            case 'percentage':
                $discount = ($cartTotal * $this->value) / 100;
                if ($this->max_discount && $discount > $this->max_discount) {
                    $discount = $this->max_discount;
                }
                break;

            case 'fixed':
                $discount = min($this->value, $cartTotal);
                break;

            case 'free_shipping':
                // La logique de livraison gratuite sera gérée ailleurs
                $discount = 0;
                break;
        }

        return ['discount' => round($discount, 2), 'type' => $this->type];
    }

    // Incrementer l'utilisation
    public function incrementUsage($userId, $orderId)
    {
        $this->increment('usage_count');
        $this->users()->attach($userId, [
            'order_id' => $orderId,
            'used_at' => now()
        ]);
    }
}
