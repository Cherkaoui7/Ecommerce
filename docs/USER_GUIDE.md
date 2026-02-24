# Guide Utilisateur - NexusCart

Ce guide explique comment un client utilise le site, de l'inscription au suivi de commande.

## 1. Ouvrir le site

- Demarrer backend et frontend.
- Ouvrir l'URL frontend dans le navigateur (local par defaut : `http://localhost:5173`).

## 2. Creer un compte ou se connecter

## 2.1 Inscription

1. Aller sur `/register`.
2. Renseigner nom, email, mot de passe.
3. Le mot de passe doit contenir :
   - au moins 8 caracteres
   - une majuscule
   - une minuscule
   - un chiffre
   - un caractere special (`@$!%*?&`)
4. Valider l'inscription.

## 2.2 Connexion

1. Aller sur `/login`.
2. Saisir email et mot de passe.
3. Apres connexion, ouvrir `/account`.

## 3. Parcourir les produits

- `/shop` : catalogue complet avec recherche/filtres.
- `/categories` : navigation par categories.
- `/products/:id` : details produit.

Actions principales :
- ajouter au panier
- ajouter a la wishlist
- ajouter a la comparaison
- lire/ajouter des avis

## 4. Wishlist et comparaison

- Wishlist : `/wishlist`
- Comparaison : `/comparison`

Ces pages servent a shortlister avant achat.

## 5. Panier et checkout

## 5.1 Panier

1. Ajouter des produits depuis shop/detail.
2. Ouvrir `/cart`.
3. Ajuster les quantites.
4. Continuer vers checkout.

## 5.2 Checkout

1. Ouvrir `/checkout`.
2. Remplir l'adresse de livraison.
3. Remplir l'adresse de facturation.
4. Confirmer le paiement.
5. Valider la commande.

Comportement cote serveur :
- le prix final est verifie en backend
- le stock est verifie et reserve en transaction

## 6. Promotions et coupons

- La validation coupon est geree par le backend pendant le checkout.
- Les coupons invalides/expres/non eligibles sont refuses avec message d'erreur.

## 7. Commandes et factures

1. Ouvrir `/account`.
2. Consulter la liste des commandes et statuts.
3. Telecharger la facture de chaque commande.

La facture est protegee : seul le proprietaire de la commande (ou admin) peut y acceder.

## 8. Avis produits

Sur la page produit :
- Voir la note moyenne et la distribution.
- Si connecte, publier un avis.
- Marquer un avis comme utile.

Regles :
- un seul avis par utilisateur et par produit
- seuls les avis approuves sont publics

## 9. Espace compte

`/account` affiche :
- informations profil (nom/email/role)
- historique commandes
- bouton telechargement facture
- bouton deconnexion

Si votre role est admin, le bouton `Admin Panel` apparait.

## 10. Pages d'information

- Promotions : `/promos`
- FAQ : `/faq`
- Contact : `/contact`
- Livraison : `/shipping`
- Retours : `/returns`
- Confidentialite : `/privacy`
- Conditions : `/terms`

## 11. Depannage

## 11.1 Echec connexion

- Verifier email/mot de passe.
- Si mot de passe recemment change, deconnecter/reconnecter.
- Vider le cache navigateur si token obsolete.

## 11.2 Image produit ou page charge mal

- Hard refresh (`Ctrl+F5`).
- Verifier que backend tourne et que `VITE_API_URL` est correct.

## 11.3 Echec creation commande

Causes possibles :
- stock modifie
- produit desactive
- backend temporairement indisponible

Action :
- rafraichir panier puis reessayer.

## 11.4 Echec telechargement facture

- Verifier que vous etes connecte.
- Verifier que la commande appartient a votre compte.
- Reessayer apres rafraichissement de session.

## 12. Bonnes pratiques securite utilisateur

- Utiliser un mot de passe fort et unique.
- Ne pas partager vos identifiants.
- Se deconnecter sur les appareils partages.
- Signaler toute activite suspecte.

