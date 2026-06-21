# ── Etapa 1: Build ──
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Etapa 2: Producción (Nginx sirve los estáticos) ──
FROM nginx:alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# ── Etapa desarrollo (Vite dev server) ──
FROM node:20-alpine AS development

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
