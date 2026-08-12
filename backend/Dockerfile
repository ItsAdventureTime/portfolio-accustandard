# Multi-stage Dockerfile for Accustandard Go REST API using floating
# docker.io/library/golang:alpine
FROM docker.io/library/golang:alpine AS builder

WORKDIR /app
COPY go.mod go.sum* ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o /accustandard-api ./cmd/server

FROM docker.io/library/alpine

RUN apk add --no-cache ca-certificates tzdata

WORKDIR /app
COPY --from=builder /accustandard-api /app/accustandard-api
COPY migrations /app/migrations

EXPOSE 8080

ENV PORT=8080
ENV DATABASE_URL="postgres://accustandard:accustandardpass@localhost:5432/accustandard_demo_db?sslmode=disable"

CMD ["/app/accustandard-api"]
