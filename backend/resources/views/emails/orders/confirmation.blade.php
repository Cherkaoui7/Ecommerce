<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation de commande</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #4F46E5;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: #f9fafb;
            padding: 30px;
            border: 1px solid #e5e7eb;
            border-radius: 0 0 5px 5px;
        }
        .order-details {
            background-color: white;
            padding: 20px;
            margin: 20px 0;
            border-radius: 5px;
            border: 1px solid #e5e7eb;
        }
        .item {
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .item:last-child {
            border-bottom: none;
        }
        .total {
            font-size: 1.2em;
            font-weight: bold;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 2px solid #4F46E5;
        }
        .button {
            display: inline-block;
            background-color: #4F46E5;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #6b7280;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Merci pour votre commande !</h1>
    </div>
    
    <div class="content">
        <p>Bonjour {{ $user->name }},</p>
        
        <p>Nous avons bien reçu votre commande <strong>#{{ $order->id }}</strong> et nous vous en remercions.</p>
        
        <div class="order-details">
            <h2>Détails de votre commande</h2>
            
            @foreach($items as $item)
            <div class="item">
                <strong>{{ $item->product_name_snapshot }}</strong><br>
                Quantité: {{ $item->quantity }} × {{ number_format($item->unit_price, 2) }}€<br>
                Sous-total: {{ number_format($item->line_total, 2) }}€
            </div>
            @endforeach
            
            <div class="total">
                Total: {{ number_format($order->total, 2) }}€
            </div>
        </div>
        
        <p><strong>Statut:</strong> {{ ucfirst($order->status) }}</p>
        <p><strong>Mode de paiement:</strong> {{ ucfirst($order->payment_method) }}</p>
        
        <p>Vous recevrez un email de confirmation dès que votre commande sera expédiée.</p>
        
        <center>
            <a href="{{ env('FRONTEND_URL', 'http://localhost:5173') }}/account/orders/{{ $order->id }}" class="button">
                Suivre ma commande
            </a>
        </center>
    </div>
    
    <div class="footer">
        <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
        <p>&copy; {{ date('Y') }} {{ config('app.name') }}. Tous droits réservés.</p>
    </div>
</body>
</html>
