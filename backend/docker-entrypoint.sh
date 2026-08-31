#!/bin/sh
set -eu

if [ -z "${DATABASE_URL:-}" ] && [ -n "${DATABASE_PASSWORD_FILE:-}" ]; then
  database_password=$(cat "$DATABASE_PASSWORD_FILE")
  : "${DATABASE_HOST:=db}"
  : "${DATABASE_NAME:=accustandard}"
  : "${DATABASE_USER:=accustandard}"
  export DATABASE_URL="postgres://${DATABASE_USER}:${database_password}@${DATABASE_HOST}:5432/${DATABASE_NAME}?sslmode=disable"
fi

exec /app/accustandard-api
