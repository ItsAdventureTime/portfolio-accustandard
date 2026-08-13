# Stage 1: Build application using a pinned Node/Alpine image.
FROM docker.io/library/node:24.18-alpine3.24 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Static export runtime. `output: 'export'` writes `/out`.
FROM docker.io/library/nginx:1.30.4-alpine AS runner
COPY --from=builder /app/out /usr/share/nginx/html/accustandard/demo
COPY deploy/nginx/static.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000
