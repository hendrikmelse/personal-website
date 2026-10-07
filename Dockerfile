# syntax=docker/dockerfile:1

# ---- build: compile the web app --------------------------------------------
FROM node:22-slim AS build
WORKDIR /app

# Manifests first so the dependency layer is cached until they change.
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/
RUN npm ci

COPY . .
RUN npm run build

# ---- runtime: static files behind unprivileged nginx -----------------------
FROM nginxinc/nginx-unprivileged:alpine AS runtime
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:8080/ || exit 1
