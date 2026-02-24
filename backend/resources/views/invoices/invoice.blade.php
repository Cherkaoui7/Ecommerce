<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Facture #{{ $order->id }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
            color: #333;
            line-height: 1.6;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
            border-bottom: 3px solid #3B82F6;
            padding-bottom: 20px;
        }
        .company-info {
            flex: 1;
        }
        .company-name {
            font-size: 28px;
            font-weight: bold;
            color: #3B82F6;
            margin-bottom: 5px;
        }
        .company-details {
            font-size: 10px;
            color: #666;
        }
        .invoice-info {
            text-align: right;
        }
        .invoice-title {
            font-size: 24px;
            font-weight: bold;
            color: #1F2937;
            margin-bottom: 10px;
        }
        .invoice-meta {
            font-size: 11px;
            color: #666;
        }
        .addresses {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }
        .address-block {
            flex: 1;
            padding: 15px;
            background: #F9FAFB;
            border-radius: 8px;
            margin-right: 15px;
        }
        .address-block:last-child {
            margin-right: 0;
        }
        .address-title {
            font-weight: bold;
            font-size: 11px;
            color: #3B82F6;
            text-transform: uppercase;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
        }
        .address-content {
            font-size: 11px;
            line-height: 1.8;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        thead {
            background: #3B82F6;
            color: white;
        }
        thead th {
            padding: 12px 10px;
            text-align: left;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        tbody td {
            padding: 12px 10px;
            border-bottom: 1px solid #E5E7EB;
            font-size: 11px;
        }
        tbody tr:hover {
            background: #F9FAFB;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .totals {
            float: right;
            width: 300px;
            margin-top: 20px;
        }
        .totals-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 11px;
        }
        .totals-row.subtotal {
            border-bottom: 1px solid #E5E7EB;
        }
        .totals-row.total {
            background: #3B82F6;
            color: white;
            padding: 12px 15px;
            font-size: 14px;
            font-weight: bold;
            border-radius: 6px;
            margin-top: 10px;
        }
        .footer {
            clear: both;
            margin-top: 60px;
            padding-top: 20px;
            border-top: 1px solid #E5E7EB;
            text-align: center;
            font-size: 10px;
            color: #9CA3AF;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
        }
        .status-pending {
            background: #FEF3C7;
            color: #92400E;
        }
        .status-completed {
            background: #D1FAE5;
            color: #065F46;
        }
        .status-shipped {
            background: #DBEAFE;
            color: #1E40AF;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="company-info">
                <div class="company-name">NEXUS Store</div>
                <div class="company-details">
                    123 Avenue des Champs-Élysées<br>
                    75008 Paris, France<br>
                    Tel: +33 1 23 45 67 89<br>
                    Email: contact@nexusstore.com<br>
                    SIRET: 123 456 789 00010
                </div>
            </div>
            <div class="invoice-info">
                <div class="invoice-title">FACTURE</div>
                <div class="invoice-meta">
                    <strong>N° {{ str_pad($order->id, 6, '0', STR_PAD_LEFT) }}</strong><br>
                    Date: {{ $order->created_at->format('d/m/Y') }}<br>
                    <span class="status-badge status-{{ $order->status }}">
                        {{ ucfirst($order->status) }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Addresses -->
        <div class="addresses">
            <div class="address-block">
                <div class="address-title">Client</div>
                <div class="address-content">
                    <strong>{{ $user->name }}</strong><br>
                    {{ $user->email }}
                </div>
            </div>

            @if($shipping_address)
            <div class="address-block">
                <div class="address-title">Adresse de livraison</div>
                <div class="address-content">
                    {{ $shipping_address['fullName'] ?? '' }}<br>
                    {{ $shipping_address['address'] ?? '' }}<br>
                    {{ $shipping_address['zipCode'] ?? '' }} {{ $shipping_address['city'] ?? '' }}<br>
                    {{ $shipping_address['country'] ?? '' }}
                </div>
            </div>
            @endif
        </div>

        <!-- Items Table -->
        <table>
            <thead>
                <tr>
                    <th>Produit</th>
                    <th class="text-center">Qté</th>
                    <th class="text-right">Prix unitaire</th>
                    <th class="text-right">Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($items as $item)
                <tr>
                    <td>{{ $item->product_name_snapshot }}</td>
                    <td class="text-center">{{ $item->quantity }}</td>
                    <td class="text-right">{{ number_format($item->unit_price, 2, ',', ' ') }} €</td>
                    <td class="text-right">{{ number_format($item->line_total, 2, ',', ' ') }} €</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <!-- Totals -->
        <div class="totals">
            <div class="totals-row subtotal">
                <span>Sous-total:</span>
                <span>{{ number_format($subtotal, 2, ',', ' ') }} €</span>
            </div>
            <div class="totals-row">
                <span>Frais de livraison:</span>
                <span>{{ number_format($shipping, 2, ',', ' ') }} €</span>
            </div>
            <div class="totals-row">
                <span>TVA (20%):</span>
                <span>{{ number_format($subtotal * 0.2, 2, ',', ' ') }} €</span>
            </div>
            <div class="totals-row total">
                <span>TOTAL TTC:</span>
                <span>{{ number_format($total, 2, ',', ' ') }} €</span>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            Merci pour votre confiance !<br>
            Cette facture est générée automatiquement et ne nécessite pas de signature.<br>
            Pour toute question, contactez-nous à support@nexusstore.com
        </div>
    </div>
</body>
</html>
