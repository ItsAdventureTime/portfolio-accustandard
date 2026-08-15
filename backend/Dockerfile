# syntax=docker/dockerfile:1
# Multi-stage Dockerfile for the Accustandard Go REST API.
# The release script builds this image locally inside the Docker Sandbox and
# transfers the resulting archive to the VPS runtime.
# Keep base versions explicit so release artifacts are reproducible.
FROM --platform=$BUILDPLATFORM docker.io/library/golang:1.26.5-alpine3.24 AS builder

ARG TARGETOS
ARG TARGETARCH

WORKDIR /app
COPY go.mod go.sum* ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=${TARGETOS} GOARCH=${TARGETARCH} \
  go build -ldflags="-w -s" -o /accustandard-api ./cmd/server

FROM --platform=$BUILDPLATFORM docker.io/library/alpine:3.24.1 AS runtime-assets

RUN apk add --no-cache ca-certificates tzdata

FROM docker.io/library/alpine:3.24.1

WORKDIR /app
COPY --from=builder /accustandard-api /app/accustandard-api
COPY migrations /app/migrations
COPY --from=runtime-assets /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
COPY --from=runtime-assets /usr/share/zoneinfo /usr/share/zoneinfo

EXPOSE 8080

ENV PORT=8080
# DATABASE_URL is injected by the Quadlet/runtime environment; never bake a
# database credential into the image metadata.

CMD ["/app/accustandard-api"]
