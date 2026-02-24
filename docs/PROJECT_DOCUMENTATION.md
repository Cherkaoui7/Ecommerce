# NexusCart - Documentation Complete du Projet

## 1. Vue d'ensemble

NexusCart est une plateforme ecommerce full-stack composee de :
- Un frontend SPA React pour les interfaces client et admin.
- Un backend API Laravel pour la logique metier, la persistance, l'authentification et le reporting.

Objectifs principaux :
- Flux ecommerce securises et coherents.
- Outils admin pratiques pour catalogue/commandes/utilisateurs.
- Exploitabilite claire (observabilite, CI, setup reproductible).

## 2. Architecture systeme

## 2.1 Architecture haut niveau

```text
Navigateur (React SPA)
    |
    | HTTPS / JSON / Bearer token
    v
API Laravel (Sanctum + role middleware)
    |
    +-- SQLite/MySQL/PostgreSQL (Eloquent)
    +-- Disque de stockage (images produits)
    +-- Queue + Mail + Notifications
```

## 2.2 Architecture frontend (`frontend/`)

- Framework : React 19 + TypeScript + Vite.
- State/context :
  - `AuthProvider` pour la session utilisateur.
  - `CartProvider`, `WishlistProvider`, `ComparisonProvider`, `NotificationProvider`.
- Acces donnees :
  - Axios `src/api/httpClient.ts` avec interceptor Bearer token.
  - React Query dans `src/main.tsx`.
- Routing :
  - Routes publiques/client dans `src/App.tsx`.
  - Route admin via `ADMIN_ROUTE_PREFIX` depuis `VITE_ADMIN_PATH`.
  - Le contenu admin change de section sans changer l'URL.
- Monitoring :
  - Error boundary (`src/components/ErrorBoundary.tsx`).
  - Sentry optionnel (`src/monitoring/sentry.ts`).

## 2.3 Architecture backend (`backend/`)

- Framework : Laravel 12 (API routes).
- Auth : Laravel Sanctum (`Authorization: Bearer ...`).
- Autorisation : middleware `role:admin` pour les endpoints admin.
- Modules metier :
  - Auth, Produits, Categories, Commandes, Factures, Utilisateurs, Avis, Coupons, Analytics, Historique produit.
- Observabilite :
  - Middleware `RequestContext` ajoute `X-Request-Id`.
  - Logs HTTP structures optionnels (`OBSERVABILITY_HTTP_LOGS`).
- Cache :
  - `CacheService` avec invalidation par tags + fallback indexe quand pas de tags.

## 3. Structure du repository

```text
.
|- frontend/
|  |- src/
|  |  |- api/
|  |  |- components/
|  |  |- context/
|  |  |- features/
|  |  |- pages/
|  |  `- types/
|  `- package.json
|- backend/
|  |- app/
|  |  |- Http/Controllers/
|  |  |- Http/Middleware/
|  |  |- Models/
|  |  |- Mail/
|  |  `- Notifications/
|  |- database/
|  |  |- migrations/
|  |  `- seeders/
|  |- routes/
|  `- composer.json
|- docs/
|  `- PROJECT_DOCUMENTATION.md
|- ADMIN_GUIDE.md
|- USER_GUIDE.md
`- README.md
```

## 4. Perimetre fonctionnel

## 4.1 Cote client

- Inscription et connexion.
- Parcours boutique et detail produit.
- Wishlist et comparaison.
- Panier et checkout.
- Validation coupon pendant le checkout.
- Historique commandes + facture PDF depuis le compte.
- Avis produits et votes utile.

## 4.2 Cote admin

- Acces via bouton `Admin Panel` depuis `/account` (role admin).
- CRUD produits avec upload image optionnel.
- Mise a jour en masse des produits.
- Historique produit + export CSV.
- CRUD categories.
- Consultation commandes + changement de statut.
- Gestion utilisateurs (nom/email/role/mot de passe).
- Dashboard analytics (semaine/mois/annee).

## 5. Installation developpement local

## 5.1 Prerequis

- Node.js 20+
- npm 10+
- PHP 8.2+
- Composer 2+

## 5.2 Demarrage backend

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

URL backend par defaut : `http://localhost:8000`

## 5.3 Demarrage frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

URL frontend par defaut : `http://localhost:5173`

## 5.4 Comptes seedes en local

- Admin : `admin@ecommerce.com` / `admin123`
- Client : `john@example.com` / `CustomerDemo!2026`

## 5.5 Notes locales importantes

- Les images produits necessitent `php artisan storage:link`.
- Pour un reset propre :

```bash
php artisan migrate:fresh --seed
```

## 6. Reference configuration

## 6.1 Variables backend (`backend/.env`)

| Variable | Raison | Valeur locale typique |
|---|---|---|
| `APP_ENV` | Mode environnement | `local` |
| `APP_DEBUG` | Erreurs detaillees | `true` (local), `false` (prod) |
| `APP_URL` | URL backend | `http://localhost:8000` |
| `DB_CONNECTION` | Driver DB | `sqlite` |
| `DB_DATABASE` | Fichier/nom DB | `database/database.sqlite` |
| `CORS_ALLOWED_ORIGINS` | Origines autorisees | `http://localhost:5173,...` |
| `OBSERVABILITY_HTTP_LOGS` | Logs HTTP completes | `true` |
| `SEED_DEMO_USERS` | Forcer users demo hors local | `false` |
| `SEED_ADMIN_PASSWORD` | Mot de passe admin seede | `admin123` |
| `SEED_CUSTOMER_PASSWORD` | Mot de passe client seede | `CustomerDemo!2026` |
| `QUEUE_CONNECTION` | Driver queue | `database` |
| `MAIL_MAILER` | Transport mail | `log` (local) |

## 6.2 Variables frontend (`frontend/.env`)

| Variable | Raison | Exemple |
|---|---|---|
| `VITE_API_URL` | URL base API | `http://localhost:8000/api` |
| `VITE_ADMIN_PATH` | Prefixe route admin | `/control-room` |
| `VITE_GA_TRACKING_ID` | ID Google Analytics | `G-XXXXXXXXXX` |
| `VITE_SENTRY_DSN` | DSN Sentry | vide en local |
| `VITE_SENTRY_ENVIRONMENT` | Environnement Sentry | `production` |
| `VITE_SENTRY_TRACES_SAMPLE_RATE` | Taux trace (0-1) | `0.1` |
| `VITE_SENTRY_ENABLE_IN_DEV` | Sentry en dev | `false` |

## 7. Resume modeles de donnees

Tables principales :

- `users`
  - `role` enum : `customer` ou `admin`.
- `categories`
  - hierarchie via `parent_id` optionnel.
- `products`
  - catalogue (prix/stock/sku/image).
- `orders`
  - statut, paiement, adresses JSON.
- `order_items`
  - snapshot de ligne immutable par commande.
- `reviews`
  - un avis par user par produit.
- `coupons` + `coupon_user`
  - cycle coupon + suivi usage par utilisateur.
- `product_history`
  - traces de modifications produit.
- `notifications`
  - notifications database.
- `personal_access_tokens`
  - tokens Sanctum.

## 8. Reference API

Base URL : `{VITE_API_URL}` (defaut `http://localhost:8000/api`)

Format de reponse :
- Succes : generalement `success: true` + `data`.
- Validation : payload Laravel de validation.
- Autorisation : `401` ou `403` avec details erreurs.

## 8.1 Endpoints auth

| Methode | Path | Acces | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Inscription client |
| `POST` | `/auth/login` | Public | Connexion + token Sanctum |
| `GET` | `/auth/user` | Authentifie | Profil courant |
| `POST` | `/auth/logout` | Authentifie | Revocation token courant |

Politique mot de passe inscription :
- minimum 8 caracteres
- au moins 1 majuscule
- au moins 1 minuscule
- au moins 1 chiffre
- au moins 1 caractere special `@$!%*?&`

## 8.2 Endpoints catalogue

| Methode | Path | Acces | Description |
|---|---|---|---|
| `GET` | `/categories` | Public | Liste categories actives |
| `GET` | `/categories/{id}` | Public | Detail categorie |
| `GET` | `/products` | Public | Produits pagines (`page`, `category_id`, `is_active`) |
| `GET` | `/products/{id}` | Public | Detail produit |

## 8.3 Endpoints catalogue admin

| Methode | Path | Acces | Description |
|---|---|---|---|
| `POST` | `/categories` | Admin | Creer categorie |
| `PUT` | `/categories/{id}` | Admin | Modifier categorie |
| `DELETE` | `/categories/{id}` | Admin | Supprimer categorie |
| `POST` | `/products` | Admin | Creer produit (JSON ou multipart image) |
| `PUT` | `/products/{id}` | Admin | Modifier produit |
| `DELETE` | `/products/{id}` | Admin | Supprimer produit |
| `PATCH` | `/products/bulk` | Admin | Mise a jour en masse |
| `GET` | `/product-history` | Admin | Historique (`action`, `product_id`, `date_from`, `date_to`) |

Validation image produit :
- champ : `image`
- doit etre une image
- max : 2 MB

## 8.4 Endpoints commandes

| Methode | Path | Acces | Description |
|---|---|---|---|
| `GET` | `/orders` | Authentifie | Commandes du client ou toutes si admin |
| `GET` | `/orders/{id}` | Authentifie | Detail commande (proprietaire ou admin) |
| `POST` | `/orders` | Authentifie | Creer commande |
| `PUT` | `/orders/{id}` | Admin | Changer statut/paiement |
| `GET` | `/orders/{id}/invoice/download` | Authentifie | Telecharger facture PDF |
| `GET` | `/orders/{id}/invoice/preview` | Authentifie | Apercu facture PDF |

Commande fiable cote serveur :
- prix produit relu depuis DB
- stock verrouille/verifie en transaction
- decrement stock atomique

## 8.5 Endpoints utilisateurs (admin)

| Methode | Path | Acces | Description |
|---|---|---|---|
| `GET` | `/users` | Admin | Liste utilisateurs |
| `GET` | `/users/{id}` | Admin | Detail utilisateur |
| `PUT` | `/users/{id}` | Admin | Modifie nom/email/role/password |

Mot de passe en update :
- optionnel
- si present : `min:8` + `confirmed`
- envoyer `password_confirmation`

## 8.6 Endpoints avis

| Methode | Path | Acces | Description |
|---|---|---|---|
| `GET` | `/products/{productId}/reviews` | Public | Avis approuves + stats |
| `POST` | `/products/{productId}/reviews/{reviewId}/helpful` | Public | Incremente utile |
| `POST` | `/reviews` | Authentifie | Creer avis |
| `PUT` | `/reviews/{id}` | Proprietaire | Modifier son avis |
| `DELETE` | `/reviews/{id}` | Proprietaire/admin | Supprimer avis |

## 8.7 Endpoints coupons

| Methode | Path | Acces | Description |
|---|---|---|---|
| `POST` | `/coupons/validate` | Public | Valider coupon sur panier |
| `GET` | `/coupons/{code}` | Public | Detail coupon |
| `GET` | `/coupons` | Admin | Liste coupons |
| `POST` | `/coupons` | Admin | Creer coupon |
| `PUT` | `/coupons/{id}` | Admin | Modifier coupon |
| `DELETE` | `/coupons/{id}` | Admin | Supprimer coupon |

## 8.8 Endpoint analytics (admin)

| Methode | Path | Acces | Description |
|---|---|---|---|
| `GET` | `/analytics/dashboard` | Admin | KPIs et series graphiques |

Parametre query :
- `period=week|month|year`

Compatibilite SQL :
- Bucket annuel adapte au driver :
  - SQLite : `strftime('%Y-%m', created_at)`
  - MySQL : `DATE_FORMAT(created_at, '%Y-%m')`

## 8.9 Exemples de requetes

### Connexion
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@ecommerce.com",
  "password": "admin123"
}
```

### Creation produit avec image
```http
POST /api/products
Authorization: Bearer <token>
Content-Type: multipart/form-data

name=Wireless Mouse
price=49.99
stock=25
category_id=1
image=<binary image file>
```

### Changement mot de passe utilisateur (admin)
```http
PUT /api/users/2
Authorization: Bearer <token>
Content-Type: application/json

{
  "password": "NewSecure123!",
  "password_confirmation": "NewSecure123!"
}
```

### Creation commande
```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "products": [
    { "id": 1, "quantity": 2 },
    { "id": 5, "quantity": 1 }
  ],
  "shipping_address": {
    "fullName": "John Doe",
    "address": "123 Main St",
    "city": "Springfield",
    "zipCode": "12345",
    "country": "US"
  },
  "billing_address": {
    "fullName": "John Doe",
    "address": "123 Main St",
    "city": "Springfield",
    "zipCode": "12345",
    "country": "US"
  },
  "payment_method": "stripe"
}
```

## 9. Authentification et autorisation

- Frontend stocke le token dans `localStorage` (`auth_token`).
- Axios ajoute `Authorization: Bearer <token>`.
- Backend protege via `auth:sanctum`.
- APIs admin protegees via `role:admin`.
- UI admin protegee en plus via `AdminRoute`.

Note route admin :
- `VITE_ADMIN_PATH` change le chemin visible.
- C'est de l'obfuscation, pas une barriere securite.

## 10. Strategie cache

Implantee dans `backend/app/Services/CacheService.php` :
- cache liste produits
- cache detail produit
- cache categories

TTL par defaut :
- liste produits : 1h
- categories : 2h
- detail produit : 30 min

Invalidation :
- ecritures produits/categories nettoient le cache associe.
- fallback indexe pour eviter `Cache::flush()` global.

## 11. Emails, notifications et queue

Flux declenches :
- Email confirmation commande.
- Email changement statut commande.
- Notifications stock bas vers admins.
- Notifications database pour commandes/stock.

Recommande en production :

```bash
cd backend
php artisan queue:work --tries=3 --timeout=90
```

Si `QUEUE_CONNECTION=database`, verifier la preparation des tables queue.

## 12. Upload fichiers et media

- Images produits via champ multipart `image`.
- Stockage sur disque `public` sous `storage/app/public/products`.
- URL generee : `<APP_URL>/storage/...`.

A executer une fois :
```bash
php artisan storage:link
```

## 13. Observabilite et suivi erreurs

Backend :
- Middleware `RequestContext` :
  - genere/propage request ID
  - ajoute header `X-Request-Id`
  - log completion (duree/statut)
- Alertes exceptions critiques possibles via Slack channel.

Frontend :
- Error boundary React pour erreurs runtime.
- Sentry optionnel via variables env.

## 14. Notes performance

Optimisations deja presentes :
- Throttling sur routes publiques/auth.
- Index DB sur produits/commandes/avis/categories.
- Cache produits/categories.
- Lazy loading des pages frontend non critiques.

Si lenteur :
- Desactiver debug en production (`APP_DEBUG=false`, `LOG_LEVEL` adapte).
- Identifier les requetes API qui echouent en boucle.
- Verifier temps reponse API et indexes DB.
- Eviter les requetes admin non bornees dans les nouvelles features.

## 15. Tests et quality gates

## 15.1 Tests backend

```bash
cd backend
php artisan test
```

Couverture principale :
- auth login/register
- creation commande
- gestion/liste produits
- analytics
- middleware request-context
- smoke flow checkout
- update mot de passe utilisateur

## 15.2 Qualite frontend

```bash
cd frontend
npm run lint
npm run build
```

## 15.3 Pipeline CI

Fichier : `.github/workflows/ci.yml`
- lint/build frontend
- tests backend
- tests smoke flow

## 16. Runbook deploiement

## 16.1 Checklist backend

1. Installer dependances :
```bash
composer install --no-dev --optimize-autoloader
```
2. Configurer `.env` production :
- `APP_ENV=production`
- `APP_DEBUG=false`
- credentials DB
- provider mail
- queue driver
- origines CORS
3. Generer APP key si absent :
```bash
php artisan key:generate
```
4. Lancer migrations :
```bash
php artisan migrate --force
```
5. Lier storage :
```bash
php artisan storage:link
```
6. Optimiser cache config/routes/views :
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```
7. Demarrer un process manager pour queue workers.

## 16.2 Checklist frontend

1. Installer et builder :
```bash
npm ci
npm run build
```
2. Variables env production :
- `VITE_API_URL=https://api.votredomaine.com/api`
- `VITE_ADMIN_PATH=/votre-route-admin-secrete`
- config GA/Sentry optionnelle
3. Servir `frontend/dist` via serveur web ou hosting statique.

## 16.3 Smoke checks post-deploiement

- Inscription/connexion ok.
- Liste produit + detail produit ok.
- Ajout panier + checkout cree commande.
- Telechargement facture ok.
- Connexion admin + panel admin ok.
- Ajout/modif produit et categorie ok.
- Analytics ok pour toutes les periodes.

## 17. Depannage

## 17.1 "The image field must be an image"

Cause :
- champ upload recu invalide (pas un fichier image).

Fix :
- envoyer en `multipart/form-data`.
- nom du champ = `image`.
- fichier reel image (`jpg/png/webp`) <= 2MB.

## 17.2 Produit cree mais invisible en boutique

Verifier :
- `is_active=true`
- stock non negatif
- filtres categories cote shop
- invalidation cache backend
- hard refresh frontend apres deploiement

## 17.3 Formulaires admin qui ne s'affichent pas

Verifier :
- build frontend a jour
- erreurs runtime JS dans console
- pas d'assets frontend stale caches
- session admin valide

## 17.4 Erreur analytics periode annee sur SQLite

La version actuelle gere le bucket SQLite.
Si erreur persistante :
- redeployer backend a jour
- `php artisan optimize:clear`
- redemarrer le process PHP

## 17.5 Beaucoup d'erreurs console + lenteur

- Ouvrir Network et trouver la requete qui echoue en boucle.
- Corriger d'abord l'erreur API racine.
- Verifier `VITE_API_URL`.
- Configurer correctement source maps/Sentry en prod.
- Reduire logs bruyants en production.

## 18. Checklist securite

- Forcer HTTPS frontend/backend.
- Garder `APP_DEBUG=false` en production.
- Changer les credentials seeded par defaut avant lancement public.
- Restreindre CORS aux domaines autorises.
- Garder le controle admin cote serveur (`role:admin`).
- Ne pas exposer stack traces/env sensibles dans reponses API.
- Imposer des mots de passe forts pour les admins.

## 19. Maintenance et extension

Quand vous ajoutez une feature :
- Garder un envelope API coherent (`success`, `data`, `message/errors`).
- Ajouter des tests feature pour endpoints proteges.
- Invalider le cache relie aux ecritures.
- Eviter code mort/routes inutilisees.
- Mettre a jour cette documentation + `ADMIN_GUIDE.md` + `USER_GUIDE.md` dans la meme PR.

---

Pour les parcours par role :
- `ADMIN_GUIDE.md`
- `USER_GUIDE.md`

