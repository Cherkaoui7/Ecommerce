<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = ['user_id', 'status', 'total', 'payment_method', 'payment_status', 'shipping_address_json', 'billing_address_json'];

    protected $appends = ['shipping_address', 'billing_address'];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function getShippingAddressAttribute()
    {
        return $this->shipping_address_json ? json_decode($this->shipping_address_json, true) : null;
    }

    public function getBillingAddressAttribute()
    {
        return $this->billing_address_json ? json_decode($this->billing_address_json, true) : null;
    }
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
