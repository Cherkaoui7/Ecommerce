<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderStatusNotification extends Notification
{
    use Queueable;

    public $order;
    public $oldStatus;

    /**
     * Create a new notification instance.
     */
    public function __construct($order, $oldStatus)
    {
        $this->order = $order;
        $this->oldStatus = $oldStatus;
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
        $statusMessages = [
            'pending' => 'En attente de traitement',
            'paid' => 'Paiement confirmé',
            'processing' => 'En cours de préparation',
            'shipped' => 'Expédiée - En cours de livraison',
            'completed' => 'Livrée avec succès',
            'cancelled' => 'Annulée'
        ];

        $message = (new MailMessage)
            ->subject('Mise à jour de votre commande #' . $this->order->id)
            ->greeting('Bonjour ' . $notifiable->name . ',')
            ->line('Le statut de votre commande a été mis à jour.')
            ->line('**Numéro de commande :** #' . $this->order->id)
            ->line('**Nouveau statut :** ' . ($statusMessages[$this->order->status] ?? ucfirst($this->order->status)));

        if ($this->order->status === 'shipped') {
            $message->line('📦 Votre colis est en route ! Vous devriez le recevoir sous 2-3 jours ouvrables.');
        } elseif ($this->order->status === 'completed') {
            $message->line('✅ Nous espérons que vous êtes satisfait de votre achat !');
        } elseif ($this->order->status === 'cancelled') {
            $message->line('Si vous avez des questions, n\'hésitez pas à nous contacter.');
        }

        return $message
            ->action('Voir ma commande', url('/account'))
            ->line('Merci de votre confiance !');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'order_id' => $this->order->id,
            'old_status' => $this->oldStatus,
            'new_status' => $this->order->status,
            'message' => 'Commande #' . $this->order->id . ' mise à jour : ' . $this->order->status
        ];
    }
}
