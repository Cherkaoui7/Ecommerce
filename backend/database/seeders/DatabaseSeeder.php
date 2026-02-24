<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Seed demo users only in local/testing (or when explicitly enabled).
        $seedDemoUsers = app()->environment(['local', 'testing'])
            || filter_var(env('SEED_DEMO_USERS', false), FILTER_VALIDATE_BOOLEAN);
        if ($seedDemoUsers) {
            $adminPassword = env('SEED_ADMIN_PASSWORD', 'admin123');
            $customerPassword = env('SEED_CUSTOMER_PASSWORD', 'CustomerDemo!2026');

            // Admin
            User::updateOrCreate([
                'email' => 'admin@ecommerce.com',
            ], [
                'name' => 'Admin User',
                'password' => Hash::make($adminPassword),
                'role' => 'admin',
            ]);

            // Customer
            User::updateOrCreate([
                'email' => 'john@example.com',
            ], [
                'name' => 'John Customer',
                'password' => Hash::make($customerPassword),
                'role' => 'customer',
            ]);
        }

        // Categories
        $electronics = Category::firstOrCreate(['slug' => 'electronics'], [
            'name' => 'Tech & Audio',
            'description' => 'Dernières innovations technologiques.',
            'is_active' => true,
        ]);

        $fashion = Category::firstOrCreate(['slug' => 'fashion'], [
            'name' => 'Mode Urbaine',
            'description' => 'Style contemporain pour la vie moderne.',
            'is_active' => true,
        ]);

        $accessories = Category::firstOrCreate(['slug' => 'accessories'], [
            'name' => 'Accessoires Luxe',
            'description' => 'Les détails qui font la différence.',
            'is_active' => true,
        ]);

        $techProducts = [
            ['Casque Sony WH-1000XM5', 'Casque audio circum-auriculaire sans fil avec réduction de bruit active leader du marché.', 399.00, 349.00, 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800&auto=format&fit=crop'],
            ['Apple AirPods Pro 2', 'Écouteurs sans fil avec réduction de bruit active, mode Transparence et audio spatial personnalisé.', 279.00, null, 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=800&auto=format&fit=crop'],
            ['Enceinte JBL Charge 5', 'Enceinte Bluetooth portable waterproof avec batterie longue durée de 20 heures.', 179.00, 149.00, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=800&auto=format&fit=crop'],
            ['Logitech MX Mechanical', 'Clavier mécanique sans fil performant avec rétroéclairage intelligent et frappe ultra-fluide.', 169.00, null, 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=800&auto=format&fit=crop'],
            ['Souris Logitech MX Master 3S', 'Souris sans fil ergonomique haute précision avec défilement ultra-rapide MagSpeed.', 129.00, null, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800&auto=format&fit=crop'],
            ['Écran LG UltraGear 27"', 'Moniteur gaming Nano IPS 1ms 144Hz, compatible NVIDIA G-SYNC.', 349.00, 299.00, 'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?q=80&w=800&auto=format&fit=crop'],
            ['Tablette Apple iPad Air', 'Écran Liquid Retina 10,9 pouces avec puce M1 et Touch ID intégré.', 699.00, null, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop'],
            ['Kindle Paperwhite', 'Liseuse étanche avec écran 6,8" haute résolution et éclairage chaud réglable.', 159.00, 139.00, 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?q=80&w=800&auto=format&fit=crop'],
            ['Batterie externe Anker', 'Power Bank 10000mAh ultra-compact charge rapide.', 45.00, null, 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?q=80&w=800&auto=format&fit=crop'],
            ['Hub Satechi Multiport', 'Adaptateur USB-C avec Ethernet, 4K HDMI, charge PD, lecteurs de cartes SD.', 89.00, null, 'https://loremflickr.com/800/800/usb']
        ];

        $fashionProducts = [
            ['Veste The North Face', 'Veste imperméable et respirante, idéale pour les aventures en plein air.', 120.00, null, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop'],
            ['Nike Air Force 1 \'07', 'Les sneakers iconiques alliant confort quotidien et style streetwear intemporel.', 119.99, null, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop'],
            ['Jean Levi\'s 501', 'Le jean original à coupe droite avec braguette boutonnée emblématique.', 109.00, 89.00, 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=800&auto=format&fit=crop'],
            ['Sweat à capuche Carhartt', 'Sweat en coton lourd, coupe loose classique avec logo brodé sur la poitrine.', 85.00, null, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop'],
            ['T-shirt Uniqlo U', 'T-shirt épais et structuré en 100% coton premium, silhouette moderne.', 19.90, null, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop'],
            ['Veste en denim Levi\'s', 'La veste en jean trucker classique qui ne se démode jamais.', 130.00, null, 'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?q=80&w=800&auto=format&fit=crop'],
            ['Pantalon Cargo Dickies', 'Pantalon cargo résistant à coupe décontractée pour un usage quotidien intensif.', 75.00, null, 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop'],
            ['Chemise flanelle Vans', 'Chemise à carreaux en flanelle douce, manches longues et coupe regular.', 65.00, 45.00, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop'],
            ['Bonnet Patagonia', 'Bonnet en laine recyclée, chaud et éthique, style unisexe.', 45.00, null, 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=800&auto=format&fit=crop'],
            ['Chaussettes Nike Sport', 'Lot de 3 paires de chaussettes Everyday Plus avec amorti ciblé.', 18.00, null, 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=800&auto=format&fit=crop']
        ];

        $accProducts = [
            ['Montre Tissot PRX', 'Montre suisse élégante au design rétro 1970 avec boîtier et bracelet en acier intégré.', 375.00, null, 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800&auto=format&fit=crop'],
            ['Portefeuille Montblanc', 'Portefeuille classique 6 compartiments en cuir de vachette pleine fleur européen noir.', 320.00, null, 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop'],
            ['Ceinture Tommy Hilfiger', 'Ceinture réversible en cuir noir et marron pour s\'adapter à toutes vos tenues.', 55.00, null, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop'],
            ['Lunettes Ray-Ban Aviator', 'Les lunettes de soleil classiques Aviator avec monture dorée et verres minéraux verts classiques.', 155.00, 135.00, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop'],
            ['Sac à dos Fossil', 'Sac à dos en cuir véritable d\'inspiration vintage avec compartiment pour ordinateur portable.', 299.00, null, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop'],
            ['Porte-cartes Secrid', 'Mini-portefeuille ingénieux qui protège vos cartes RFID tout en restant ultra-compact.', 65.00, null, 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=800&auto=format&fit=crop'],
            ['Parfum Tom Ford Oud Wood', 'Eau de parfum 50ml, une composition boisée rare, exotique et distinctive.', 265.00, null, 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop'],
            ['Cravate en soie Hugo Boss', 'Cravate italienne tissée pure soie pour un look professionnel impeccable.', 85.00, null, 'https://loremflickr.com/800/800/tie'],
            ['Boutons de manchette Emporio Armani', 'Boutons de manchette en acier inoxydable argenté avec logo gravé élégant.', 110.00, 95.00, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop'],
            ['Mallette cuir Samsonite', 'Porte-documents haut de gamme en cuir de qualité supérieure pour professionnels.', 250.00, 210.00, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop']
        ];

        $allCategories = [
            ['model' => $electronics, 'prefix' => 'TECH', 'items' => $techProducts],
            ['model' => $fashion, 'prefix' => 'FASH', 'items' => $fashionProducts],
            ['model' => $accessories, 'prefix' => 'ACC', 'items' => $accProducts],
        ];

        foreach ($allCategories as $cat) {
            foreach ($cat['items'] as $index => $item) {
                // Ensure a valid integer sequence
                $num = str_pad($index + 1, 3, '0', STR_PAD_LEFT);

                Product::create([
                    'category_id' => $cat['model']->id,
                    'name' => $item[0],
                    'slug' => \Illuminate\Support\Str::slug($item[0]),
                    'description' => $item[1],
                    'price' => $item[2],
                    'old_price' => $item[3],
                    'stock' => rand(10, 150),
                    'is_active' => true,
                    'sku' => "{$cat['prefix']}-RC-{$num}",
                    'image_url' => $item[4]
                ]);
            }
        }
    }
}
