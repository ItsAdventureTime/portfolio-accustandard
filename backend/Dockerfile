# Multi-stage Dockerfile for the Accustandard Go REST API.
# Keep base versions explicit so remote builds are reproducible.
FROM docker.io/library/golang:1.26.5-alpine3.24 AS builder

WORKDIR /app
COPY go.mod go.sum* ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o /accustandard-api ./cmd/server

FROM docker.io/library/alpine:3.24.1

RUN apk add --no-cache ca-certificates tzdata

WORKDIR /app
COPY --from=builder /accustandard-api /app/accustandard-api
COPY migrations /app/migrations

EXPOSE 8080

ENV PORT=8080
# DATABASE_URL is injected by the Quadlet/runtime environment; never bake a
# database credential into the image metadata.

CMD ["/app/accustandard-api"]
