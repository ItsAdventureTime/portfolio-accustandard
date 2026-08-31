# syntax=docker/dockerfile:1
FROM docker.io/library/node:alpine AS builder

ARG ACCUSTANDARD_BASE_PATH=/demo/accustandard
ENV ACCUSTANDARD_BASE_PATH=${ACCUSTANDARD_BASE_PATH}
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM docker.io/library/nginx:alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/out /usr/share/nginx/html
