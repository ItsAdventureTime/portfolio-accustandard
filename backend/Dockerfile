# syntax=docker/dockerfile:1
# Multi-stage Dockerfile for the Accustandard Go REST API.
# The release path builds this image locally inside the Docker Sandbox and
# transfers the resulting archive to the VPS runtime.
# Floating Alpine tags intentionally receive upstream security updates on rebuild.
FROM --platform=$BUILDPLATFORM docker.io/library/golang:alpine AS builder

ARG TARGETOS
ARG TARGETARCH

WORKDIR /app
COPY go.mod go.sum* ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=${TARGETOS} GOARCH=${TARGETARCH} \
  go build -ldflags="-w -s" -o /accustandard-api ./cmd/server

FROM --platform=$BUILDPLATFORM docker.io/library/alpine:latest AS runtime-assets

RUN apk add --no-cache ca-certificates tzdata

FROM docker.io/library/alpine:latest

WORKDIR /app
COPY --from=builder /accustandard-api /app/accustandard-api
COPY migrations /app/migrations
COPY --from=runtime-assets /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
COPY --from=runtime-assets /usr/share/zoneinfo /usr/share/zoneinfo
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod 0555 /app/docker-entrypoint.sh

EXPOSE 8080

ENV PORT=8080
# DATABASE_URL is injected by the Quadlet/runtime environment; never bake a
# database credential into the image metadata.

CMD ["/app/docker-entrypoint.sh"]
