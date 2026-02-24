<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Product;
use App\Models\User;
use App\Notifications\LowStockNotification;

class CheckLowStockProducts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'stock:check-low {--threshold=10 : Stock threshold for low stock alert}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check for low stock products and send notifications to admins';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $threshold = $this->option('threshold');
        
        $this->info("Checking for products with stock <= {$threshold}...");

        // Récupérer les produits avec un stock bas
        $lowStockProducts = Product::where('is_active', true)
            ->where('stock', '<=', $threshold)
            ->where('stock', '>=', 0)
            ->get();

        if ($lowStockProducts->isEmpty()) {
            $this->info('✓ All products have sufficient stock.');
            return 0;
        }

        $this->warn("Found {$lowStockProducts->count()} product(s) with low stock:");

        // Récupérer les admins
        $admins = User::where('role', 'admin')->get();

        if ($admins->isEmpty()) {
            $this->error('No admin users found to send notifications.');
            return 1;
        }

        $notificationsSent = 0;

        foreach ($lowStockProducts as $product) {
            $this->line("  - {$product->name} ({$product->sku}): {$product->stock} unit(s)");
            
            // Envoyer notification à chaque admin
            foreach ($admins as $admin) {
                try {
                    $admin->notify(new LowStockNotification($product, $product->stock));
                    $notificationsSent++;
                } catch (\Exception $e) {
                    $this->error("Failed to send notification for {$product->name}: " . $e->getMessage());
                }
            }
        }

        $this->info("✓ Sent {$notificationsSent} notification(s) to {$admins->count()} admin(s).");
        
        return 0;
    }
}
