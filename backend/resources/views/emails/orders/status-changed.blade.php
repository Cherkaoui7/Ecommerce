<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mise à jour de commande</title>
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
        .status-box {
            background-color: white;
            padding: 20px;
            margin: 20px 0;
            border-radius: 5px;
            border-left: 4px solid #4F46E5;
        }
        .status-change {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 15px 0;
        }
        .status {
            padding: 8px 16px;
            border-radius: 5px;
            font-weight: bold;
        }
        .status-old {
            background-color: #e5e7eb;
            color: #6b7280;
        }
        .status-new {
            background-color: #dcfce7;
            color: #16a34a;
        }
        .arrow {
            font-size: 1.5em;
            color: #4F46E5;
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
        <h1>Mise à jour de votre commande</h1>
    </div>
    
    <div class="content">
        <p>Bonjour {{ $order->user->name }},</p>
        
        <p>Le statut de votre commande <strong>#{{ $order->id }}</strong> a été mis à jour.</p>
        
        <div class="status-box">
            <h3>Changement de statut</h3>
            <div class="status-change">
                <span class="status status-old">{{ ucfirst($oldStatus) }}</span>
                <span class="arrow">→</span>
                <span class="status status-new">{{ ucfirst($newStatus) }}</span>
            </div>
            
            @if($newStatus === 'shipped')
                <p style="margin-top: 20px;">
                    <strong>📦 Votre commande a été expédiée !</strong><br>
                    Vous devriez la recevoir dans les prochains jours.
                </p>
            @elseif($newStatus === 'completed')
                <p style="margin-top: 20px;">
                    <strong>✅ Votre commande a été livrée !</strong><br>
                    Nous espérons que vous êtes satisfait de votre achat.
                </p>
            @elseif($newStatus === 'processing')
                <p style="margin-top: 20px;">
                    <strong>⚙️ Votre commande est en cours de préparation.</strong><br>
                    Elle sera bientôt expédiée.
                </p>
            @elseif($newStatus === 'cancelled')
                <p style="margin-top: 20px;">
                    <strong>❌ Votre commande a été annulée.</strong><br>
                    Si vous avez des questions, n'hésitez pas à nous contacter.
                </p>
            @endif
        </div>
        
        <center>
            <a href="{{ env('FRONTEND_URL', 'http://localhost:5173') }}/account/orders/{{ $order->id }}" class="button">
                Voir ma commande
            </a>
        </center>
    </div>
    
    <div class="footer">
        <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
        <p>&copy; {{ date('Y') }} {{ config('app.name') }}. Tous droits réservés.</p>
    </div>
</body>
</html>
