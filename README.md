
# TechHeaven

# Sujet

Ce projet consiste en la création d'un site e-commerce complet, offrant une authentification sécurisée, 
une recherche de produits avancée, une gestion d'alertes par e-mail, un panier avec système de réservation, 
une intégration de plateforme de paiement, une gestion de livraison, une gestion des stocks, un historique de commande, 
et un panel d'administration avec des rôles d'utilisateurs différents. 
Une caractéristique clé de ce projet est la flexibilité totale pour choisir le thème du site e-commerce et vendre 
n'importe quel type de produit, offrant ainsi une solution adaptée aux besoins de chaque utilisateur. 
Des fonctionnalités bonus comprennent la gestion des données personnelles, les opérations de promotion, 
un dashboard comptabilité, la possibilité de se connecter en tant qu'utilisateur, 
et des options de livraison variées.


## Contributeurs

- [@Ulysseassoo](uassooemane@myges.fr) - ASSO'O EMANE Ulysse
  - Inscription avec confirmation par mail
  - Connexion et prévention de la connexion si le compte n'est pas confirmé 
  - Réintialisation du mot de passe
  - Intégration des recommandations de la CNIL concernant la sécurité des mots de passe pour un site e-commerce
  - Intégration des pages d'authentifications
  - Intégration de la suppresion de compte
  - Panel Admin CRUD 
  - Dashboard Admin (KPI, Graphiques)
  - Intégration gestion de stock
  - Intégration du rôle du gestionnaire de stock
  - Gestion des alertes emails avec visibilité côté client (inscription newsletter & sur des nouveaux produits d'une catégorie)
  - Création du composant table en vue js avec export CSV
  - Création dʼun composable permettant de gérer un formulaire rapidement et efficacement
  - Montrer l'historique de commande côté client
  - Rechercher dans l'historique de commande
  - Ajouter / Supprimer des addresses pour un utilisateur
  - Intégration page profil
  - Mettre à jour les informations de l'utilisateur
- [@fabian222222](fzuo@myges.fr) - ZUO Fabian
  - Recherches produits
  - Recherche via description produit / nom
  - Recherche facettée (nom, catégorie, marque, prix)
  - Création & Gestion du panier
  - Intégration stripe côté front
  - Passer une commande & payer la commande
  - Ajout de promotions & CRUD promotions
- [@jphayek](jhayek@myges.fr) - HAYEK Jean Paul
  - Test unitaires
  - Développement de la partie livraison en côté serveur
  - Développement de la partie stripe côté serveur 
  - CRUD Produit
  - CRUD Catégorie
  - Implémentation de la générationd de facture
  - CRUD Facture
  - Envoie de facture côté back + PDF


## Installation
Il ne faut pas oublier de créer votre fichier .env à la racine du projet et rajouter les clés tel que le fichier .env.example
Lancer les commandes ci-dessous dans l'ordre donnée.


```bash
  docker compose up --detach --build
```
    