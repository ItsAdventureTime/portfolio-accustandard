# 2026 Podman Isolated Disposable Static Export Builder
# Image: node:current-alpine

FROM node:current-alpine AS builder

WORKDIR /workspace

# Install dependencies cleanly inside Alpine Linux environment
COPY package.json package-lock.json ./
RUN npm ci

# Copy application source code
COPY . .

# Run static export compilation
RUN npm run build

# Disposable Output Stage
FROM scratch AS export
COPY --from=builder /workspace/out /out
