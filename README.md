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

- Gestion de jardins
- Gestion de créneaux de disponibilité
- Réservation de créneaux et gestion de statut
- Authentification et contrôle d’accès
- Interface utilisateur en React

---

## Stack technique

- **Front-end** : React, Vite, JavaScript  
- **Back-end** : Node.js, Express, Prisma  
- **Base de données** : PostgreSQL  
- **Outillage** : Docker, Docker Compose, PgAdmin, Git/GitHub  

---

## Prérequis

- Node.js (version LTS recommandée)
- Docker Desktop
- Git

---

## Installation et lancement

### 1) Clonage du dépôt

~~~bash
git clone https://github.com/ton-username/JardinSolidaire.git
cd JardinSolidaire
~~~

---

### 2) Lancement de l’environnement Docker

L’application est orchestrée avec **Docker Compose** afin d’assurer un environnement cohérent et reproductible.

~~~bash
docker-compose up --build
~~~

En arrière-plan :

~~~bash
docker-compose up -d
~~~

Arrêt des conteneurs :

~~~bash
docker-compose down
~~~

---

### 3) Accès PgAdmin (administration PostgreSQL)

PgAdmin est accessible ici :

~~~text
http://localhost:5050
~~~

---

## Lancer le front-end (React / Vite)

Installation des dépendances :

~~~bash
npm install
~~~

Lancement :

~~~bash
npm run dev
~~~

Accès (par défaut) :

~~~text
http://localhost:3000
~~~

---

## Dépannage – ports déjà utilisés

Si un serveur est resté actif et bloque un port :

~~~bash
lsof -ti :3000 | xargs kill -9
lsof -ti :5001 | xargs kill -9
~~~

---

## Sécurité (synthèse)

- Authentification via **JWT**
- Routes sensibles protégées par middleware
- Validation côté serveur (contrôles d’inputs)
- Accès base de données centralisé via **Prisma** (cohérence, intégrité, lisibilité)
- Variables d’environnement isolées (configuration et secrets)

---

## Structure du projet (indicative)

~~~text
JardinSolidaire/
├── backend/        # API Node.js / Express
├── frontend/       # Application React (Vite)
├── docker-compose.yml
└── README.md
~~~

---

## Autrice

**Thalia Woods** — Projet RNCP (Concepteur·trice Développeur·se d’Applications)
