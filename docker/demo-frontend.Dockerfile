# syntax=docker/dockerfile:1
FROM docker.io/library/node:lts-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN ACCUSTANDARD_BASE_PATH="" npm run build

FROM docker.io/library/nginx:alpine
COPY docker/demo-nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/out /usr/share/nginx/html
