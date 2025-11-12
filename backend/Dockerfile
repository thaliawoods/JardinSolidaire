# backend/Dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Keep node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy prisma first and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the app
COPY . .

# Your platform will set PORT; default to 5001 locally
ENV PORT=5001
EXPOSE 5001

# Apply DB migrations then start the server
CMD ["sh","-c","npx prisma migrate deploy && node server.js"]
    