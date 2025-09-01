# ---- Builder Stage ----
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install  # Generate package-lock.json if missing
RUN npm ci       # Use lockfile for clean install
RUN npm install -g @nestjs/cli

COPY . .
RUN npm run build

# ---- Production Stage ----
FROM node:18-alpine AS production
WORKDIR /app

RUN addgroup -g 1001 -S nodejs \
    && adduser -S nestjs -u 1001


USER nestjs
CMD ["node", "dist/main.js"]
