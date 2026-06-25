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

## 🐳 Lancement Rapide

### ☁️ Dans le Cloud (Zéro Installation)
Vous pouvez lancer l'intégralité du projet directement dans votre navigateur via GitHub Codespaces :
1. Cliquez sur le bouton vert **"Code"** en haut à droite.
2. Allez dans l'onglet **"Codespaces"**.
3. Cliquez sur **"Create codespace on main"**.
4. Attendez que l'environnement se construise (environ 2 min). Le site s'ouvrira automatiquement !

### 💻 En Local (Docker)
Pour lancer l'intégralité de la plateforme sur votre machine :

```bash
docker-compose up -d --build
```

Une fois lancé :
- **Frontend** : `http://localhost:5173`
- **Backend API** : `http://localhost:8000`
- **Documentation API** : `http://localhost:8000/api`

---
*Projet réalisé dans le cadre de l'UE Conception de Systèmes d'Information.*
