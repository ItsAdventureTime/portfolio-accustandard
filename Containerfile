# 2026 Podman Isolated Disposable Static Export Builder
# Image: docker.io/library/node:lts-alpine

FROM docker.io/library/node:lts-alpine AS builder

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
