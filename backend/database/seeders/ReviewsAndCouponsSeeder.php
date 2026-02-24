<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Review;
use App\Models\Coupon;
use App\Models\Product;
use App\Models\User;

class ReviewsAndCouponsSeeder extends Seeder
{
    public function run(): void
    {
        // Créer des avis pour les 10 premiers produits
        $products = Product::take(10)->get();
        $users = User::all();

        if ($users->isEmpty()) {
            echo "Aucun utilisateur trouvé. Créez un utilisateur d'abord.\n";
            return;
        }

        $comments = [
            ['rating' => 5, 'comment' => 'Excellent produit ! Je recommande fortement.', 'title' => 'Parfait !'],
            ['rating' => 4, 'comment' => 'Très bon rapport qualité/prix. Livraison rapide.', 'title' => 'Très satisfait'],
            ['rating' => 5, 'comment' => 'Qualité exceptionnelle, conforme à la description.', 'title' => 'Top qualité'],
            ['rating' => 4, 'comment' => 'Bon produit, quelques améliorations possibles.', 'title' => 'Bon achat'],
            ['rating' => 3, 'comment' => 'Correct, répond aux attentes sans plus.', 'title' => 'Pas mal'],
        ];

        // Vérifier si des reviews existent déjà
        $existingReviews = Review::count();
        
        if ($existingReviews == 0) {
            foreach ($products as $index => $product) {
                // Créer 1-2 avis par produit avec différents utilisateurs
                $numReviews = rand(1, min(2, $users->count()));
                $usedUsers = [];
                
                for ($i = 0; $i < $numReviews; $i++) {
                    // Sélectionner un utilisateur qui n'a pas encore commenté ce produit
                    do {
                        $user = $users->random();
                    } while (in_array($user->id, $usedUsers) && count($usedUsers) < $users->count());
                    
                    $usedUsers[] = $user->id;
                    $commentData = $comments[rand(0, count($comments) - 1)];
                    
                    Review::create([
                        'product_id' => $product->id,
                        'user_id' => $user->id,
                        'rating' => $commentData['rating'],
                        'title' => $commentData['title'],
                        'comment' => $commentData['comment'],
                        'verified_purchase' => rand(0, 1) == 1,
                        'is_approved' => true,
                    ]);
                }
            }
            echo "Avis créés avec succès!\n";
        } else {
            echo "Des avis existent déjà, pas de création.\n";
        }

        // Vérifier si des coupons existent déjà
        if (Coupon::count() > 0) {
            echo "Des coupons existent déjà, pas de création.\n";
            return;
        }
        
        // Créer quelques codes promo
        Coupon::create([
            'code' => 'BIENVENUE10',
            'type' => 'percentage',
            'value' => 10,
            'min_purchase' => 50,
            'starts_at' => now(),
            'expires_at' => now()->addMonths(3),
            'is_active' => true,
            'description' => '10% de réduction pour les nouveaux clients'
        ]);

        Coupon::create([
            'code' => 'PROMO20',
            'type' => 'percentage',
            'value' => 20,
            'min_purchase' => 100,
            'max_discount' => 50,
            'starts_at' => now(),
            'expires_at' => now()->addMonth(),
            'is_active' => true,
            'description' => '20% de réduction sur les commandes de 100€+'
        ]);

        Coupon::create([
            'code' => 'FIXE15',
            'type' => 'fixed',
            'value' => 15,
            'min_purchase' => 75,
            'starts_at' => now(),
            'expires_at' => now()->addMonths(2),
            'is_active' => true,
            'description' => '15€ de réduction immédiate'
        ]);

        Coupon::create([
            'code' => 'LIVRAISON',
            'type' => 'free_shipping',
            'value' => 0,
            'min_purchase' => 30,
            'starts_at' => now(),
            'expires_at' => now()->addMonths(6),
            'is_active' => true,
            'description' => 'Livraison gratuite dès 30€ d\'achat'
        ]);

        echo "Seeder terminé avec succès!\n";
    }
}
