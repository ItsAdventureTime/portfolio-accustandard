# Stage 1: Build application using the floating Node Alpine image.
FROM docker.io/library/node:lts-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Static export runtime. `output: 'export'` writes `/out`.
FROM docker.io/library/nginx:alpine AS runner
COPY --from=builder /app/out /usr/share/nginx/html/accustandard/demo
COPY deploy/nginx/static.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000
