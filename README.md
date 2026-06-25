# CONCEPTION SI - Marketplace Multiservices 🚀

Bienvenue sur le dépôt du projet **CONCEPTION SI**. Ce projet consiste en la conception et le développement d'une plateforme de marketplace moderne, permettant la mise en relation entre vendeurs et clients avec une modération administrative robuste.

## 📌 Présentation du Projet
Ce système d'information a été conçu pour répondre aux besoins de digitalisation des échanges commerciaux, offrant une interface intuitive pour les vendeurs et une sécurité accrue pour les acheteurs via un système de validation des publications.

### 🔑 Fonctionnalités Clés
- **Espace Administrateur** : Gestion des utilisateurs, validation des statuts "Vendeur", et modération des produits.
- **Espace Vendeur** : Gestion de catalogue, ajout de produits avec images, et suivi des stocks.
- **Catalogue Public** : Recherche intelligente (Tolérance aux fautes via Levenshtein), filtrage par catégories dynamiques.
- **Contact Direct** : Intégration WhatsApp pour faciliter les transactions.

## 🛠 Stack Technique
- **Backend** : Laravel 11 (PHP 8.2+) avec Sanctum pour l'authentification API.
- **Frontend** : React.js avec Vite, Tailwind CSS pour une interface fluide et responsive.
- **Base de données** : MySQL.
- **Conteneurisation** : Docker & Docker Compose.

## 📂 Documentation & Analyse
Les documents de conception sont disponibles dans le dossier `/doc` :
- [📄 Cahier des Charges](./doc/1_Cahier_des_Charges_v2.pdf)
- [📄 Cahier d'Analyse](./doc/2_Cahier_dAnalyse_v2.pdf)
- [📊 Diagrammes de Conception](./doc/diagrammes/)

## 🐳 Lancement Rapide (Docker)
Pour lancer l'intégralité de la plateforme en une seule commande :

```bash
docker-compose up -d --build
```

Une fois lancé :
- **Frontend** : `http://localhost:5173`
- **Backend API** : `http://localhost:8000`
- **Documentation API** : `http://localhost:8000/api`

---
*Projet réalisé dans le cadre de l'UE Conception de Systèmes d'Information.*
