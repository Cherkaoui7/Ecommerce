import type { Category, Product } from '../types';

export const LOCAL_CATEGORIES: Category[] = [
    {
        "id":  1,
        "name":  "Tech \u0026 Audio",
        "slug":  "electronics",
        "description":  "Dernières innovations technologiques.",
        "is_active":  true
    },
    {
        "id":  2,
        "name":  "Mode Urbaine",
        "slug":  "fashion",
        "description":  "Style contemporain pour la vie moderne.",
        "is_active":  true
    },
    {
        "id":  3,
        "name":  "Accessoires Luxe",
        "slug":  "accessories",
        "description":  "Les détails qui font la différence.",
        "is_active":  true
    }
];

export const LOCAL_PRODUCTS: Product[] = [
    {
        "id":  1,
        "category_id":  2,
        "name":  "Casque Sony WH-1000XM5",
        "slug":  "casque-sony-wh-1000xm5",
        "description":  "Casque audio circum-auriculaire sans fil avec réduction de bruit active leader du marché.",
        "price":  1236,
        "old_price":  349,
        "stock":  64,
        "is_active":  false,
        "sku":  "TECH-RC-001",
        "image_url":  "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80\u0026w=800\u0026auto=format\u0026fit=crop",
        "category":  {
                         "id":  2,
                         "name":  "Mode Urbaine",
                         "slug":  "fashion",
                         "description":  "Style contemporain pour la vie moderne.",
                         "is_active":  true
                     }
    },
    {
        "id":  2,
        "category_id":  1,
        "name":  "Apple AirPods Pro 2",
        "slug":  "apple-airpods-pro-2",
        "description":  "Écouteurs sans fil avec réduction de bruit active, mode Transparence et audio spatial personnalisé.",
        "price":  279,
        "old_price":  null,
        "stock":  149,
        "is_active":  true,
        "sku":  "TECH-RC-002",
        "image_url":  "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80\u0026w=800\u0026auto=format\u0026fit=crop",
        "category":  {
                         "id":  1,
                         "name":  "Tech \u0026 Audio",
                         "slug":  "electronics",
                         "description":  "Dernières innovations technologiques.",
                         "is_active":  true
                     }
    },
    {
        "id":  3,
        "category_id":  1,
        "name":  "Enceinte JBL Charge 5",
        "slug":  "enceinte-jbl-charge-5",
        "description":  "Enceinte Bluetooth portable waterproof avec batterie longue durée de 20 heures.",
        "price":  179,
        "old_price":  149,
        "stock":  124,
        "is_active":  true,
        "sku":  "TECH-RC-003",
        "image_url":  "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80\u0026w=800\u0026auto=format\u0026fit=crop",
        "category":  {
                         "id":  1,
                         "name":  "Tech \u0026 Audio",
                         "slug":  "electronics",
                         "description":  "Dernières innovations technologiques.",
                         "is_active":  true
                     }
    },
    {
        "id":  4,
        "category_id":  1,
        "name":  "Logitech MX Mechanical",
        "slug":  "logitech-mx-mechanical",
        "description":  "Clavier mécanique sans fil performant avec rétroéclairage intelligent et frappe ultra-fluide.",
        "price":  169,
        "old_price":  null,
        "stock":  47,
        "is_active":  true,
        "sku":  "TECH-RC-004",
        "image_url":  "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80\u0026w=800\u0026auto=format\u0026fit=crop",
        "category":  {
                         "id":  1,
                         "name":  "Tech \u0026 Audio",
                         "slug":  "electronics",
                         "description":  "Dernières innovations technologiques.",
                         "is_active":  true
                     }
    },
    {
        "id":  5,
        "category_id":  1,
        "name":  "Souris Logitech MX Master 3S",
        "slug":  "souris-logitech-mx-master-3s",
        "description":  "Souris sans fil ergonomique haute précision avec défilement ultra-rapide MagSpeed.",
        "price":  129,
        "old_price":  null,
        "stock":  73,
        "is_active":  true,
        "sku":  "TECH-RC-005",
        "image_url":  "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80\u0026w=800\u0026auto=format\u0026fit=crop",
        "category":  {
                         "id":  1,
                         "name":  "Tech \u0026 Audio",
                         "slug":  "electronics",
                         "description":  "Dernières innovations technologiques.",
                         "is_active":  true
                     }
    },
    {
        "id":  6,
        "category_id":  1,
        "name":  "Écran LG UltraGear 27\"",
        "slug":  "ecran-lg-ultragear-27",
        "description":  "Moniteur gaming Nano IPS 1ms 144Hz, compatible NVIDIA G-SYNC.",
        "price":  349,
        "old_price":  299,
        "stock":  48,
        "is_active":  true,
        "sku":  "TECH-RC-006",
        "image_url":  "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?q=80\u0026w=800\u0026auto=format\u0026fit=crop",
        "category":  {
                         "id":  1,
                         "name":  "Tech \u0026 Audio",
                         "slug":  "electronics",
                         "description":  "Dernières innovations technologiques.",
                         "is_active":  true
                     }
    },
    {
        "id":  7,
        "category_id":  1,
        "name":  "Tablette Apple iPad Air",
        "slug":  "tablette-apple-ipad-air",
        "description":  "Écran Liquid Retina 10,9 pouces avec puce M1 et Touch ID intégré.",
        "price":  699,
        "old_price":  null,
        "stock":  149,
        "is_active":  true,
        "sku":  "TECH-RC-007",
        "image_url":  "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80\u0026w=800\u0026auto=format\u0026fit=crop",
        "category":  {
                         "id":  1,
                         "name":  "Tech \u0026 Audio",
                         "slug":  "electronics",
                         "description":  "Dernières innovations technologiques.",
                         "is_active":  true
                     }
    },
    {
        "id":  8,
        "category_id":  1,
        "name":  "Kindle Paperwhite",
        "slug":  "kindle-paperwhite",
        "description":  "Liseuse étanche avec écran 6,8\" haute résolution et éclairage chaud réglable.",
        "price":  159,
        "old_price":  139,
        "stock":  87,
        "is_active":  true,
        "sku":  "TECH-RC-008",
        "image_url":  "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?q=80\u0026w=800\u0026auto=format\u0026fit=crop",
        "category":  {
                         "id":  1,
                         "name":  "Tech \u0026 Audio",
                         "slug":  "electronics",
                         "description":  "Dernières innovations technologiques.",
                         "is_active":  true
                     }
    },
    {
        "id":  9,
        "category_id":  1,
        "name":  "Batterie externe Anker",
        "slug":  "batterie-externe-anker",
        "description":  "Power Bank 10000mAh ultra-compact charge rapide.",
        "price":  45,
        "old_price":  null,
        "stock":  55,
        "is_active":  true,
        "sku":  "TECH-RC-009",
        "image_url":  "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?q=80\u0026w=800\u0026auto=format\u0026fit=crop",
        "category":  {
                         "id":  1,
                         "name":  "Tech \u0026 Audio",
                         "slug":  "electronics",
                         "description":  "Dernières innovations technologiques.",
                         "is_active":  true
                     }
    },
    {
        "id":  10,
        "category_id":  1,
        "name":  "Hub Satechi Multiport",
        "slug":  "hub-satechi-multiport",
        "description":  "Adaptateur USB-C avec Ethernet, 4K HDMI, charge PD, lecteurs de cartes SD.",
        "price":  89,
        "old_price":  null,
        "stock":  86,
        "is_active":  true,
        "sku":  "TECH-RC-010",
        "image_url":  "https://loremflickr.com/800/800/usb",
        "category":  {
                         "id":  1,
                         "name":  "Tech \u0026 Audio",
                         "slug":  "electronics",
                         "description":  "Dernières innovations technologiques.",
                         "is_active":  true
                     }
    },
    {
        "id":  11,
        "category_id":  2,
        "name":  "Veste The North Face",
        "slug":  "veste-the-north-face",
        "description":  "Veste imperméable et respirante, idéale pour les aventures en plein air.",
        "price":  120,
        "old_price":  null,
        "stock":  124,
        "is_active":  true,
        "sku":  "FASH-RC-001",
        "image_url":  "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80\u0026w=800\u0026auto=format\u0026fit=crop",
        "category":  {
                         "id":  2,
                         "name":  "Mode Urbaine",
                         "slug":  "fashion",
                         "description":  "Style contemporain pour la vie moderne.",
                         "is_active":  true
                     }
    },
    {
        "id":  12,
        "category_id":  2,
        "name":  "Nike Air Force 1 \u002707",
        "slug":  "nike-air-force-1-07",
        "description":  "Les sneakers iconiques alliant confort quotidien et style streetwear intemporel.",
        "price":  119.99,
        "old_price":  null,
        "stock":  60,
        "is_active":  true,
        "sku":  "FASH-RC-002",
        "image_url":  "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80\u0026w=800\u0026auto=format\u0026fit=crop",
        "category":  {
                         "id":  2,
                         "name":  "Mode Urbaine",
                         "slug":  "fashion",
                         "description":  "Style contemporain pour la vie moderne.",
                         "is_active":  true
                     }
    },
    {
        "id":  13,
        "category_id":  2,
        "name":  "Jean Levi\u0027s 501",
        "slug":  "jean-levis-501",
        "description":  "Le jean original à coupe droite avec braguette boutonnée emblématique.",
        "price":  109,
        "old_price":  89,
        "stock":  28,
        "is_active":  true,
        "sku":  "FASH-RC-003",
        "image_url":  "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80\u0026w=800\u0026auto=format\u0026fit=crop",
        "category":  {
                         "id":  2,
                         "name":  "Mode Urbaine",
                         "slug":  "fashion",
                         "description":  "Style contemporain pour la vie moderne.",
                         "is_active":  true
                     }
    },
    {
        "id":  14,
        "category_id":  2,
        "name":  "Sweat à capuche Carhartt",
        "slug":  "sweat-a-capuche-carhartt",
        "description":  "Sweat en coton lourd, coupe loose classique avec logo brodé sur la poitrine.",
        "price":  85,
        "old_price":  null,
        "stock":  111,
        "is_active":  true,
        "sku":  "FASH-RC-004",
        "image_url":  "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80\u0026w=800\u0026auto=format\u0026fit=crop",
        "category":  {
                         "id":  2,
                         "name":  "Mode Urbaine",
                         "slug":  "fashion",
                         "description":  "Style contemporain pour la vie moderne.",
                         "is_active":  true
                     }
    },
    {
        "id":  15,
        "category_id":  2,
        "name":  "T-shirt Uniqlo U",
        "slug":  "t-shirt-uniqlo-u",
        "description":  "T-shirt épais et structuré en 100% coton premium, silhouette moderne.",
        "price":  19.9,
        "old_price":  null,
        "stock":  36,
        "is_active":  true,
        "sku":  "FASH-RC-005",
        "image_url":  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80\u0026w=800\u0026auto=format\u0026fit=crop",
        "category":  {
                         "id":  2,
                         "name":  "Mode Urbaine",
                         "slug":  "fashion",
                         "description":  "Style contemporain pour la vie moderne.",
                         "is_active":  true
                     }
    },
    {
        "id":  16,
        "category_id":  2,
        "name":  "Veste en denim Levi\u0027s",
        "slug":  "veste-en-denim-levis",
        "description":  "La veste en jean trucker classique qui ne se démode jamais.",
        "price":  130,
        "old_price":  null,
        "stock":  67,
        "is_active":  true,
        "sku":  "FASH-RC-006",
        "image_url":  "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?q=80\u0026w=800\u0026auto=format\u0026fit=crop",
        "category":  {
                         "id":  2,
                         "name":  "Mode Urbaine",
                         "slug":  "fashion",
                         "description":  "Style contemporain pour la vie moderne.",
                         "is_active":  true
                     }
    },
    {
        "id":  17,
        "category_id":  2,
        "name":  "Pantalon Cargo Dickies",
        "slug":  "pantalon-cargo-dickies",
        "description":  "Pantalon cargo résistant à coupe décontractée pour un usage quotidien intensif.",
        "price":  75,
        "old_price":  null,
        "stock":  100,
        "is_active":  true,
        "sku":  "FASH-RC-007",
        "image_url":  "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80\u0026w=800\u0026auto=format\u0026fit=crop",
        "category":  {
                         "id":  2,
                         "name":  "Mode Urbaine",
                         "slug":  "fashion",
                         "description":  "Style contemporain pour la vie moderne.",
                         "is_active":  true
                     }
    },
    {
        "id":  18,
        "category_id":  2,
        "name":  "Chemise flanelle Vans",
        "slug":  "chemise-flanelle-vans",
        "description":  "Chemise à carreaux en flanelle douce, manches longues et coupe regular.",
        "price":  65,
        "old_price":  45,
        "stock":  81,
        "is_active":  true,
        "sku":  "FASH-RC-008",
        "image_url":  "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80\u0026w=800\u0026auto=format\u0026fit=crop",
        "category":  {
                         "id":  2,
                         "name":  "Mode Urbaine",
                         "slug":  "fashion",
                         "description":  "Style contemporain pour la vie moderne.",
                         "is_active":  true
                     }
    },
    {
        "id":  19,
        "category_id":  2,
        "name":  "Bonnet Patagonia",
        "slug":  "bonnet-patagonia",
        "description":  "Bonnet en laine recyclée, chaud et éthique, style unisexe.",
        "price":  45,
        "old_price":  null,
        "stock":  58,
        "is_active":  true,
        "sku":  "FASH-RC-009",
        "image_url":  "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80\u0026w=800\u0026auto=format\u0026fit=crop",
        "category":  {
                         "id":  2,
                         "name":  "Mode Urbaine",
                         "slug":  "fashion",
                         "description":  "Style contemporain pour la vie moderne.",
                         "is_active":  true
                     }
    },
    {
        "id":  20,
        "category_id":  2,
        "name":  "Chaussettes Nike Sport",
        "slug":  "chaussettes-nike-sport",
        "description":  "Lot de 3 paires de chaussettes Everyday Plus avec amorti ciblé.",
        "price":  18,
        "old_price":  null,
        "stock":  30,
        "is_active":  true,
        "sku":  "FASH-RC-010",
        "image_url":  "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80\u0026w=800\u0026auto=format\u0026fit=crop",
        "category":  {
                         "id":  2,
                         "name":  "Mode Urbaine",
                         "slug":  "fashion",
                         "description":  "Style contemporain pour la vie moderne.",
                         "is_active":  true
                     }
    },
    {
        "id":  21,
        "category_id":  3,
        "name":  "Montre Tissot PRX",
        "slug":  "montre-tissot-prx",
        "description":  "Montre suisse élégante au design rétro 1970 avec boîtier et bracelet en acier intégré.",
        "price":  375,
        "old_price":  null,
        "stock":  122,
        "is_active":  true,
        "sku":  "ACC-RC-001",
        "image_url":  "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80\u0026w=800\u0026auto=format\u0026fit=crop",
        "category":  {
                         "id":  3,
                         "name":  "Accessoires Luxe",
                         "slug":  "accessories",
                         "description":  "Les détails qui font la différence.",
                         "is_active":  true
                     }
    },
    {
        "id":  22,
        "category_id":  3,
        "name":  "Portefeuille Montblanc",
        "slug":  "portefeuille-montblanc",
        "description":  "Portefeuille classique 6 compartiments en cuir de vachette pleine fleur européen noir.",
        "price":  320,
        "old_price":  null,
        "stock":  71,
        "is_active":  true,
        "sku":  "ACC-RC-002",
        "image_url":  "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80\u0026w=800\u0026auto=format\u0026fit=crop",
        "category":  {
                         "id":  3,
                         "name":  "Accessoires Luxe",
                         "slug":  "accessories",
                         "description":  "Les détails qui font la différence.",
                         "is_active":  true
                     }
    },
    {
        "id":  23,
        "category_id":  3,
        "name":  "Ceinture Tommy Hilfiger",
        "slug":  "ceinture-tommy-hilfiger",
        "description":  "Ceinture réversible en cuir noir et marron pour s\u0027adapter à toutes vos tenues.",
        "price":  55,
        "old_price":  null,
        "stock":  113,
        "is_active":  true,
        "sku":  "ACC-RC-003",
        "image_url":  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80\u0026w=800\u0026auto=format\u0026fit=crop",
        "category":  {
                         "id":  3,
                         "name":  "Accessoires Luxe",
                         "slug":  "accessories",
                         "description":  "Les détails qui font la différence.",
                         "is_active":  true
                     }
    },
    {
        "id":  24,
        "category_id":  3,
        "name":  "Lunettes Ray-Ban Aviator",
        "slug":  "lunettes-ray-ban-aviator",
        "description":  "Les lunettes de soleil classiques Aviator avec monture dorée et verres minéraux verts classiques.",
        "price":  155,
        "old_price":  135,
        "stock":  62,
        "is_active":  true,
        "sku":  "ACC-RC-004",
        "image_url":  "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80\u0026w=800\u0026auto=format\u0026fit=crop",
        "category":  {
                         "id":  3,
                         "name":  "Accessoires Luxe",
                         "slug":  "accessories",
                         "description":  "Les détails qui font la différence.",
                         "is_active":  true
                     }
    },
    {
        "id":  25,
        "category_id":  3,
        "name":  "Sac à dos Fossil",
        "slug":  "sac-a-dos-fossil",
        "description":  "Sac à dos en cuir véritable d\u0027inspiration vintage avec compartiment pour ordinateur portable.",
        "price":  299,
        "old_price":  null,
        "stock":  150,
        "is_active":  true,
        "sku":  "ACC-RC-005",
        "image_url":  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80\u0026w=800\u0026auto=format\u0026fit=crop",
        "category":  {
                         "id":  3,
                         "name":  "Accessoires Luxe",
                         "slug":  "accessories",
                         "description":  "Les détails qui font la différence.",
                         "is_active":  true
                     }
    },
    {
        "id":  26,
        "category_id":  3,
        "name":  "Porte-cartes Secrid",
        "slug":  "porte-cartes-secrid",
        "description":  "Mini-portefeuille ingénieux qui protège vos cartes RFID tout en restant ultra-compact.",
        "price":  65,
        "old_price":  null,
        "stock":  114,
        "is_active":  true,
        "sku":  "ACC-RC-006",
        "image_url":  "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80\u0026w=800\u0026auto=format\u0026fit=crop",
        "category":  {
                         "id":  3,
                         "name":  "Accessoires Luxe",
                         "slug":  "accessories",
                         "description":  "Les détails qui font la différence.",
                         "is_active":  true
                     }
    },
    {
        "id":  27,
        "category_id":  3,
        "name":  "Parfum Tom Ford Oud Wood",
        "slug":  "parfum-tom-ford-oud-wood",
        "description":  "Eau de parfum 50ml, une composition boisée rare, exotique et distinctive.",
        "price":  265,
        "old_price":  null,
        "stock":  37,
        "is_active":  true,
        "sku":  "ACC-RC-007",
        "image_url":  "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80\u0026w=800\u0026auto=format\u0026fit=crop",
        "category":  {
                         "id":  3,
                         "name":  "Accessoires Luxe",
                         "slug":  "accessories",
                         "description":  "Les détails qui font la différence.",
                         "is_active":  true
                     }
    },
    {
        "id":  28,
        "category_id":  3,
        "name":  "Cravate en soie Hugo Boss",
        "slug":  "cravate-en-soie-hugo-boss",
        "description":  "Cravate italienne tissée pure soie pour un look professionnel impeccable.",
        "price":  85,
        "old_price":  null,
        "stock":  15,
        "is_active":  true,
        "sku":  "ACC-RC-008",
        "image_url":  "https://loremflickr.com/800/800/tie",
        "category":  {
                         "id":  3,
                         "name":  "Accessoires Luxe",
                         "slug":  "accessories",
                         "description":  "Les détails qui font la différence.",
                         "is_active":  true
                     }
    },
    {
        "id":  29,
        "category_id":  3,
        "name":  "Boutons de manchette Emporio Armani",
        "slug":  "boutons-de-manchette-emporio-armani",
        "description":  "Boutons de manchette en acier inoxydable argenté avec logo gravé élégant.",
        "price":  110,
        "old_price":  95,
        "stock":  59,
        "is_active":  true,
        "sku":  "ACC-RC-009",
        "image_url":  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80\u0026w=800\u0026auto=format\u0026fit=crop",
        "category":  {
                         "id":  3,
                         "name":  "Accessoires Luxe",
                         "slug":  "accessories",
                         "description":  "Les détails qui font la différence.",
                         "is_active":  true
                     }
    },
    {
        "id":  30,
        "category_id":  3,
        "name":  "Mallette cuir Samsonite",
        "slug":  "mallette-cuir-samsonite",
        "description":  "Porte-documents haut de gamme en cuir de qualité supérieure pour professionnels.",
        "price":  250,
        "old_price":  210,
        "stock":  78,
        "is_active":  true,
        "sku":  "ACC-RC-010",
        "image_url":  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80\u0026w=800\u0026auto=format\u0026fit=crop",
        "category":  {
                         "id":  3,
                         "name":  "Accessoires Luxe",
                         "slug":  "accessories",
                         "description":  "Les détails qui font la différence.",
                         "is_active":  true
                     }
    },
    {
        "id":  31,
        "category_id":  1,
        "name":  "laptop",
        "slug":  "laptop",
        "description":  "gamer",
        "price":  1000,
        "old_price":  null,
        "stock":  8,
        "is_active":  true,
        "sku":  null,
        "image_url":  null,
        "category":  {
                         "id":  1,
                         "name":  "Tech \u0026 Audio",
                         "slug":  "electronics",
                         "description":  "Dernières innovations technologiques.",
                         "is_active":  true
                     }
    }
];
