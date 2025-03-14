# dockerfile en mode développement 
# en mode production il faut modifier 

# Étape 1 - Build Vite
FROM node:22 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]