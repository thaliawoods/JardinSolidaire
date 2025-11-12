# backend/Dockerfile
FROM node:22-slim

# TLS & runtime deps
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates openssl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Prisma client
COPY prisma ./prisma
RUN npx prisma generate

# App source
COPY . .

ENV NODE_ENV=production
EXPOSE 5001

# Force migrations to use the DIRECT_URL, then start server (runtime uses DATABASE_URL)
CMD sh -c 'DATABASE_URL="$DIRECT_URL" npx prisma migrate deploy && node server.js'
