FROM node:22-alpine
WORKDIR /app

# deps first (cache-friendly)
COPY package.json package-lock.json ./
RUN npm ci

# copy prisma first and generate client
COPY prisma ./prisma
RUN npx prisma generate

# then copy the rest (node_modules is ignored by .dockerignore)
COPY . .

EXPOSE 5001
# safety: (re)generate at runtime in case schema changed
CMD ["sh", "-c", "npx prisma generate && npm run dev"]
