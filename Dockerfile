# Stage 1: Build application using Node 24 Alpine (node:24-alpine)
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Static export runtime. `output: 'export'` writes `/out`.
FROM nginx:alpine AS runner
COPY --from=builder /app/out /usr/share/nginx/html/accustandard/demo
COPY deploy/nginx/static.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000
