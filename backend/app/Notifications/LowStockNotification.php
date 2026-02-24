<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LowStockNotification extends Notification
{
    use Queueable;

    public $product;
    public $currentStock;

    /**
     * Create a new notification instance.
     */
    public function __construct($product, $currentStock)
    {
        $this->product = $product;
        $this->currentStock = $currentStock;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $urgencyLevel = $this->currentStock == 0 ? '🔴 STOCK ÉPUISÉ' : '⚠️ STOCK BAS';

        return (new MailMessage)
            ->subject($urgencyLevel . ' - ' . $this->product->name)
            ->greeting('Bonjour,')
            ->line('Alerte de stock pour le produit suivant :')
            ->line('**Produit :** ' . $this->product->name)
            ->line('**SKU :** ' . $this->product->sku)
            ->line('**Stock actuel :** ' . $this->currentStock . ' unité(s)')
            ->line($this->currentStock == 0 
                ? '🚨 Le produit est en rupture de stock. Réapprovisionnement urgent recommandé.' 
                : '⚠️ Le stock est faible. Pensez à réapprovisionner ce produit.')
            ->action('Gérer le produit', url('/admin/products'))
            ->line('Cette alerte a été générée automatiquement par le système de gestion des stocks.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'product_id' => $this->product->id,
            'product_name' => $this->product->name,
            'sku' => $this->product->sku,
            'current_stock' => $this->currentStock,
            'message' => 'Stock bas : ' . $this->product->name . ' (' . $this->currentStock . ' unités)'
        ];
    }
}
