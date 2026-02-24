<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Ensure there is a user and product to test with
$user = \App\Models\User::first() ?? \App\Models\User::factory()->create();
$product = \App\Models\Product::first();

if (!$product) {
    echo json_encode(['error' => 'No products found in DB.']);
    exit;
}

$request = \Illuminate\Http\Request::create('/api/orders', 'POST', [
    'products' => [
        [
            'id' => $product->id,
            'quantity' => 1,
            'price' => $product->price
        ]
    ],
    'shipping_address' => [
        'fullName' => 'Test',
        'address' => 'Test',
        'city' => 'Test',
        'zipCode' => '12345',
        'country' => 'Test'
    ],
    'billing_address' => [
        'fullName' => 'Test',
        'address' => 'Test',
        'city' => 'Test',
        'zipCode' => '12345',
        'country' => 'Test'
    ],
    'payment_method' => 'credit_card'
]);

$response = app()->handle($request);
echo "\nStatus Code: " . $response->getStatusCode() . "\n";
echo "Response: " . $response->getContent() . "\n";
