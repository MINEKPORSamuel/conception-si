# Marché Libre — Marketplace Multiservices 🛍️

> Projet réalisé dans le cadre de l'UE **Conception de Systèmes d'Information** — v1.0 stable

Plateforme de marketplace moderne permettant la mise en relation entre vendeurs et clients, avec une modération administrative robuste et une recherche intelligente tolérante aux fautes de frappe.

---

## 📌 Présentation

Ce système d'information répond aux besoins de digitalisation des échanges commerciaux. Il offre une interface intuitive pour les vendeurs, une sécurité accrue pour les acheteurs via un système de validation des publications, et un contact direct par WhatsApp.

### 🔑 Fonctionnalités

| Espace | Fonctionnalités |
|---|---|
| 🌍 **Public** | Catalogue, recherche intelligente (Levenshtein), filtrage par catégories, fiche produit, contact WhatsApp |
| 🏪 **Vendeur** | Tableau de bord, CRUD produits, upload d'image, suivi des stocks |
| 🛡️ **Admin** | Gestion des rôles, validation vendeurs, modération des publications, statistiques globales |

---

## 🛠 Stack Technique

| Couche | Technologie |
|---|---|
| **Backend** | Laravel 12 (PHP 8.2+) |
| **Authentification** | Laravel Sanctum (token Bearer) |
| **Rôles & Permissions** | Spatie Laravel Permission |
| **Frontend** | React 18 + Vite |
| **Style** | Tailwind CSS + CSS personnalisé |
| **Base de données** | MySQL 8.0 |
| **Conteneurisation** | Docker & Docker Compose |

---

## 📂 Documentation

| Document | Lien |
|---|---|
| 📄 Cahier des Charges | [1_Cahier_des_Charges_v2.pdf](./doc/1_Cahier_des_Charges_v2.pdf) |
| 📄 Cahier d'Analyse | [2_Cahier_dAnalyse_v2.pdf](./doc/2_Cahier_dAnalyse_v2.pdf) |
| 📊 Diagrammes UML & MCD/MLD | [/doc/diagrammes/](./doc/diagrammes/) |
| 📝 Rapport de projet | [Marche_Libre_Rapport.docx](./doc/Marche_Libre_Rapport.docx) |
| 🗂️ Flashcards de révision | [flashcard.html](./doc/flashcard.html) |

---

## 🐳 Lancement Rapide

### ☁️ Dans le Cloud (Zéro Installation)

Lancez le projet directement dans votre navigateur via **GitHub Codespaces** :
1. Cliquez sur le bouton vert **"Code"** en haut à droite.
2. Allez dans l'onglet **"Codespaces"**.
3. Cliquez sur **"Create codespace on main"**.
4. Attendez ~2 min. Le site s'ouvre automatiquement !

### 💻 En Local (Docker)

```bash
docker-compose up -d --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000/api |

---

## 🔑 Compte Administrateur par Défaut

Un seeder crée automatiquement le compte admin au premier lancement :

```
Email    : admin@marche-libre.com
Password : Admin@1234
```

> ⚠️ Pensez à changer le mot de passe en production.

---

## 📁 Structure du Projet

```
CONCEPTION-SI/
├── backend/          # API Laravel 12
│   ├── app/
│   │   ├── Http/Controllers/   # AuthController, ProductController, AdminController
│   │   └── Models/             # User, Product
│   ├── database/
│   │   └── migrations/         # 10 migrations
│   └── routes/api.php          # Routes API REST
├── frontend/         # SPA React + Vite
│   └── src/
│       ├── views/              # 10 pages (Home, Catalog, Dashboard...)
│       ├── components/         # ProtectedRoute
│       ├── context/            # AuthContext
│       └── services/           # Appels API
├── doc/              # Documentation complète
│   ├── diagrammes/             # 9 diagrammes UML + MCD/MLD
│   ├── flashcard.html          # Flashcards de révision
│   └── Marche_Libre_Rapport.docx
└── docker-compose.yml          # Orchestration 3 services
```

---

*v1.0 — Juin 2026*
