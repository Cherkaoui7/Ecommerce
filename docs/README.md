# Plateforme Ecommerce NexusCart

Projet full-stack oriente production avec :
- `frontend` : React 19 + Vite + TypeScript
- `backend` : Laravel 12 + Sanctum + support SQLite/MySQL

Ce depot fournit les parcours client, un espace admin, l'analytics, la facturation PDF, l'historique produit, les avis/coupons, et des garde-fous CI.

## 1. Fonctionnalites principales

- Authentification client (inscription/connexion/deconnexion) avec tokens API.
- Catalogue produits avec filtrage par categorie, detail produit, pagination.
- Panier et checkout avec prix verifies cote serveur et verrouillage du stock.
- Historique des commandes et telechargement de facture PDF.
- Avis produits et votes "utile".
- Validation des coupons.
- Espace admin (URL unique + navigation interne par section) :
  - dashboard
  - produits (CRUD + mise a jour en masse + upload image)
  - categories (CRUD)
  - gestion des commandes
  - gestion des utilisateurs (mot de passe optionnel)
  - analytics (semaine/mois/annee)
  - historique produit + export CSV
- Notifications sur le cycle de vie des commandes et alertes stock bas.
- Base observabilite (request IDs + logs HTTP structures).
- Error boundary frontend + integration Sentry optionnelle.

## 2. Stack technique

### Frontend
- React 19
- TypeScript
- Vite 7
- Tailwind CSS 4
- Axios
- React Query
- Chart.js / react-chartjs-2

### Backend
- Laravel 12 (PHP 8.2+)
- Laravel Sanctum
- Eloquent ORM
- DomPDF pour les factures
- Support des jobs en base de donnees

## 3. Structure du projet

```text
.
|- frontend/                 # SPA React
|- backend/                  # API Laravel
|- docs/                     # Documentation technique complete
|- ADMIN_GUIDE.md            # Guide operationnel admin
|- USER_GUIDE.md             # Guide utilisateur final
`- README.md
```

## 4. Demarrage rapide (local)

### Prerequis
- Node.js 20+
- npm 10+
- PHP 8.2+
- Composer 2+

### Setup backend
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

### Setup frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

URL frontend par defaut : `http://localhost:5173`

## 5. Comptes demo locaux

Quand les utilisateurs demo sont seedes :
      *** Demo credentials are for local learning only ***

- Admin : `admin@ecommerce.com` / `admin123`
- Client : `john@example.com` / `CustomerDemo!2026`

Notes :
- En environnement `local`, les comptes demo sont crees/mis a jour via `DatabaseSeeder`.
- Vous pouvez surcharger les mots de passe via `SEED_ADMIN_PASSWORD` et `SEED_CUSTOMER_PASSWORD`.

## 6. Commandes qualite

### Frontend
```bash
cd frontend
npm run lint
npm run build
```

### Backend
```bash
cd backend
php artisan test
```

### CI
Workflow GitHub Actions : `.github/workflows/ci.yml`
- lint + build frontend
- tests backend
- smoke flow checkout

## 7. Pre-requis de deploiement

Minimum pour production :
- Mettre `APP_ENV=production` et `APP_DEBUG=false`.
- Configurer une vraie base (MySQL/PostgreSQL recommande).
- Configurer CORS (`CORS_ALLOWED_ORIGINS`) avec le domaine frontend.
- Lancer les migrations : `php artisan migrate --force`.
- Lancer `php artisan storage:link` pour les images produits.
- Demarrer un worker queue (`php artisan queue:work`).
- Builder le frontend (`npm run build`) et servir les assets statiques.

Le runbook detaille est dans `docs/PROJECT_DOCUMENTATION.md`.

## 8. Index documentation

- Documentation technique complete : `docs/PROJECT_DOCUMENTATION.md`
- Guide operations admin : `ADMIN_GUIDE.md`
- Guide utilisateur final : `USER_GUIDE.md`

## 9. Note securite

- L'obfuscation de route admin via `VITE_ADMIN_PATH` reduit la decouverte casuale, mais ce n'est pas une protection forte.
- La vraie protection est appliquee par le backend : `auth:sanctum` + `role:admin`.
