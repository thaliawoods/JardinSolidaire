# backend/Dockerfile
FROM node:22-alpine
WORKDIR /app

# Install deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Generate Prisma client
COPY prisma ./prisma
RUN npx prisma generate

# App source
COPY . .

ENV NODE_ENV=production
EXPOSE 5001

# Run migrations at start, then start the server
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
