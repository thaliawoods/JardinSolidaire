# JardinSolidaire  
**Projet de certification RNCP – Concepteur·trice Développeur·se d’Applications**

JardinSolidaire est une application web développée dans le cadre du projet de certification RNCP.  
L’objectif est de concevoir une plateforme permettant de mettre en relation des **propriétaires de jardins** et des **jardinier·es solidaires**, afin d’organiser des interventions via un système de **créneaux de disponibilité** et de **réservations**.

Le projet est réalisé dans une démarche **professionnelle et orientée production** : architecture claire, sécurité, environnement reproductible et préparation au déploiement.

---

## Objectifs 

- Concevoir une application (front-end / back-end) répondant à un besoin identifié
- Structurer une API maintenable (routes, contrôleurs, séparation des responsabilités)
- Modéliser et exploiter une base de données relationnelle (PostgreSQL)
- Sécuriser les accès (authentification, autorisation, validation)
- Mettre en place un environnement reproductible (Docker, variables d’environnement)

---

## Fonctionnalités principales

- Gestion de jardins (création / édition / suppression)
- Gestion de créneaux de disponibilité
- Réservation de créneaux et gestion de statuts
- Authentification et contrôle d’accès
- Messagerie et favoris (selon l’état du projet)

---

## Stack technique

- **Front-end** : Next.js (React), JavaScript  
- **Back-end** : Node.js, Express, Prisma  
- **Base de données** : PostgreSQL  
- **Outillage** : Docker, Docker Compose, PgAdmin, Git/GitHub  

> ⚠️ Le front utilise une version récente de Next.js qui requiert **Node >= 20.9**.

---

## Prérequis

- **Node.js >= 20.9** (recommandé : Node 20 LTS)
- Docker Desktop
- Git

### nvm (recommandé)
Pour utiliser `nvm` et se caler sur la version du projet :

~~~bash
cd frontend
nvm install 20
nvm use 20
node -v
~~~

---

## Installation & lancement

### 1) Clonage du dépôt

~~~bash
git clone https://github.com/thaliawoods/JardinSolidaire.git
cd JardinSolidaire
~~~

---

### 2) Lancement via Docker (recommandé)

L’application est orchestrée avec **Docker Compose** afin d’assurer un environnement cohérent et reproductible.

~~~bash
docker compose up --build
~~~

En arrière-plan :

~~~bash
docker compose up -d --build
~~~

Arrêt des conteneurs :

~~~bash
docker compose down
~~~

---

### 3) Accès PgAdmin (administration PostgreSQL)

~~~text
http://localhost:5050
~~~

---

## Lancer l’application en local (sans Docker)

### Back-end (API)
~~~bash
cd backend
npm ci
npx prisma generate
# migrations / schema selon le setup :
npx prisma migrate deploy || npx prisma db push
npm run dev
~~~

API (par défaut) :

~~~text
http://localhost:5001
~~~

### Front-end (Next.js)
~~~bash
cd frontend
npm ci
npm run dev
~~~

Front (par défaut) :

~~~text
http://localhost:3000
~~~

> ℹ️ Si le port 3000 est déjà pris, Next.js utilisera automatiquement un autre port (ex: 3001).

---

## Dépannage

### Port déjà utilisé
~~~bash
lsof -ti :3000 | xargs kill -9
lsof -ti :3001 | xargs kill -9
lsof -ti :5001 | xargs kill -9
~~~

### “Node.js >= 20.9 required”
Si Node 18 est installé, passer à Node 20 :

~~~bash
cd frontend
nvm use 20
node -v
npm run dev
~~~

---

## Sécurité (synthèse)

- Authentification via **JWT**
- Routes sensibles protégées par middleware
- Validation côté serveur (contrôles d’inputs)
- Accès base de données centralisé via **Prisma** (cohérence, intégrité, lisibilité)
- Variables d’environnement isolées (configuration et secrets)

---

## Structure du projet

~~~text
JardinSolidaire/
├── backend/                 # API Node.js / Express
├── frontend/                # App Next.js
├── docker-compose.yml
├── playwright.config.cjs
└── README.md
~~~

---

## Autrice

**Thalia Woods** — Projet RNCP (Concepteur·trice Développeur·se d’Applications)

en collaboration avec **Hanaë Vernon** et **Médina Bouillart**
