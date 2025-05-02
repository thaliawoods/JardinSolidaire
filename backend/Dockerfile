# Étape 1 : image de base Node.js
FROM node:22

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier uniquement les fichiers de dépendances en premier (optimise les builds)
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers backend
COPY . .


RUN npm run build

# Exposer le port sur lequel tourne le backend (5000 dans ton cas)
EXPOSE 5000

# Commande de démarrage (en mode dev ou prod selon ton usage)
CMD ["npm", "run", "dev"]
