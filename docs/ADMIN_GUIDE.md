# Guide Admin - NexusCart

Ce guide explique comment un administrateur exploite la plateforme de facon sure.

## 1. Acces et permissions

- Seuls les comptes avec `role=admin` peuvent appeler les APIs admin.
- Connectez-vous en admin, allez sur `/account`, puis cliquez `Admin Panel`.
- Le chemin admin est defini par `VITE_ADMIN_PATH` (defaut `/control-room`).

Important :
- Cacher l'URL admin aide contre la decouverte basique mais ne remplace pas la securite.
- La protection reelle est backend : `auth:sanctum` + `role:admin`.

## 2. Mode de navigation admin

- L'espace admin utilise une URL d'entree unique.
- La sidebar change les sections sans changer l'URL.
- La derniere section active est restauree depuis la session.

Sections principales :
- Dashboard
- Produits
- Categories
- Commandes
- Utilisateurs
- Analytics
- Historique produit (depuis Produits -> Historique)

## 3. Gestion des produits

## 3.1 Ajouter un produit

1. Ouvrir `Produits`.
2. Cliquer `Ajouter un produit`.
3. Renseigner les champs requis :
   - nom
   - prix
   - stock
4. Champs optionnels :
   - description
   - categorie
   - image
5. Enregistrer.

Regles image :
- Le champ doit etre `image`.
- Le fichier doit etre une image valide.
- Taille max : 2MB.

## 3.2 Modifier un produit

1. Cliquer `Editer` sur la ligne produit.
2. Modifier les valeurs.
3. Enregistrer.

## 3.3 Supprimer un produit

1. Cliquer `Supprimer`.
2. Confirmer.

## 3.4 Edition en masse

1. Selectionner un ou plusieurs produits via les cases.
2. Cliquer `Editer en masse`.
3. Activer seulement les champs a changer :
   - prix
   - stock (`set`, `add`, `subtract`)
   - categorie
   - statut actif/inactif
4. Appliquer.

## 3.5 Historique produit

- Depuis `Produits`, cliquer `Historique`.
- Consulter le journal (create/update/delete/bulk_update).
- Ouvrir les details pour voir les valeurs avant/apres.
- Exporter en CSV si besoin.

## 4. Gestion des categories

1. Ouvrir `Categories`.
2. Ajouter ou modifier nom + statut actif.
3. Supprimer les categories inutiles.

## 5. Gestion des commandes

1. Ouvrir `Commandes`.
2. Cliquer `Voir` sur une commande.
3. Verifier client, ville, total, lignes.
4. Modifier le statut et enregistrer.

Statuts autorises :
- `pending`
- `paid`
- `processing`
- `shipped`
- `completed`
- `cancelled`

## 6. Gestion des utilisateurs

1. Ouvrir `Utilisateurs`.
2. Cliquer `Editer` sur l'utilisateur cible.
3. Champs modifiables :
   - nom
   - email
   - role (`admin` ou `customer`)
   - nouveau mot de passe + confirmation (optionnel)
4. Enregistrer.

Notes mot de passe :
- Laisser vide pour ne pas changer le mot de passe.
- Min 8 caracteres.
- Confirmation obligatoire et identique.

## 7. Analytics

1. Ouvrir `Analytics`.
2. Choisir la periode :
   - 7 derniers jours
   - 30 derniers jours
   - 12 derniers mois
3. Verifier les KPIs et graphiques :
   - tendance revenu
   - top produits
   - distribution statuts
   - commandes recentes

## 8. Verifications avant/apres deploiement

## 8.1 Avant deploiement

- `npm run build` frontend passe.
- `php artisan test` backend passe.
- Migrations verifiees.
- Pas de credentials debug/defaut en production.

## 8.2 Apres deploiement

- Connexion admin ok.
- Ouverture admin panel ok.
- Test rapide de chaque section.
- Creer/modifier categorie et produit.
- Verifier apparition du produit en boutique.
- Modifier un utilisateur et confirmer la sauvegarde.
- Verifier analytics sur toutes les periodes.

## 9. Configuration env admin

Frontend (`frontend/.env`) :
```env
VITE_API_URL=https://your-api-domain/api
VITE_ADMIN_PATH=/your-secret-admin-path
```

Backend (`backend/.env`) :
- `APP_ENV=production`
- `APP_DEBUG=false`
- `CORS_ALLOWED_ORIGINS=<domaine-frontend>`
- config base/mail/queue correcte

## 10. Depannage

## 10.1 Form modal invisible

- Verifier erreurs runtime dans la console navigateur.
- Hard refresh (`Ctrl+F5`).
- Verifier coherences versions frontend/backend deployee.

## 10.2 Produit non visible en shop

- Verifier `is_active`.
- Verifier filtres categorie.
- Verifier requete create produit reussie (Network).

## 10.3 Erreur upload image

- Utiliser un vrai fichier image (`jpg`, `png`, `webp`).
- Taille <= 2MB.
- Ne pas envoyer une URL texte dans le champ fichier `image`.

## 10.4 Erreur analytics sur 12 mois

- Verifier backend a jour.
- Vider cache backend : `php artisan optimize:clear`.
- Redemarrer le process PHP.

## 11. Bonnes pratiques securite

- Limiter le nombre de comptes admins.
- Rotation periodique des mots de passe admins.
- Pas de compte partage entre operateurs.
- Surveiller les logs auth/actions admin.
- Changer le mot de passe admin seed par defaut en production.

