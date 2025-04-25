# dockerfile en mode développement 
# en mode production il faut modifier 

# Étape 1 - Build Vite
FROM node:22 AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
# on compile Next.js !
RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "dev"]