# Optional Docker Sandbox static export builder.
# Keep the Node/Alpine versions explicit for reproducible builds.

FROM docker.io/library/node:24.18-alpine3.24 AS builder

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
