# Stage 1: Build application using the latest Node/Alpine image.
FROM docker.io/library/node:alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Static export runtime. `output: 'export'` writes `/out`.
FROM docker.io/library/nginx:alpine AS runner
COPY --from=builder /app/out /usr/share/nginx/html
COPY deploy/nginx/static.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000
