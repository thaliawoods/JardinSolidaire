# Étape 1 : image de base Node.js
FROM node:22-alpine


# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier uniquement les fichiers de dépendances en premier (optimise les builds)
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers backend
COPY . .

RUN npx prisma generate

# Exposer le port sur lequel tourne le backend (5001 dans ton cas)
EXPOSE 5001

# Commande de démarrage (en mode dev ou prod selon ton usage)
CMD ["npm", "run", "dev"]
