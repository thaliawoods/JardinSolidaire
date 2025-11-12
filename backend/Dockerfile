# backend/Dockerfile
FROM node:22-alpine

# ✅ TLS + Prisma runtime deps
RUN apk add --no-cache ca-certificates openssl libc6-compat
# keep CA bundle up to date
RUN update-ca-certificates

WORKDIR /app

# deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# prisma client
COPY prisma ./prisma
RUN npx prisma generate

# app source
COPY . .

ENV NODE_ENV=production
EXPOSE 5001

# ✅ Use direct URL for migrations (schema uses directUrl internally, but this is extra-safe)
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
