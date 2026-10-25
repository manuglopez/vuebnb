#!/usr/bin/env bash
# Arranca la app para el E2E: build de Vite + SQLite sembrada + php artisan serve.
# Uso: bash tests/e2e/serve.sh [puerto]
set -euo pipefail

PORT="${1:-8771}"
DB="${VUEBNB_E2E_DB:-$(mktemp /tmp/vuebnb-e2e-XXXXXX.sqlite)}"
rm -f "$DB"
: > "$DB"
export DB_CONNECTION=sqlite
export DB_DATABASE="$DB"
export APP_URL="http://127.0.0.1:${PORT}"
export APP_ENV=local

echo "[serve.sh] build de Vite…"
node node_modules/vite/bin/vite.js build
echo "[serve.sh] migraciones + seed en $DB…"
php artisan migrate:fresh --seed --force --no-interaction
echo "[serve.sh] sirviendo en ${APP_URL}"
exec php artisan serve --host=127.0.0.1 --port="${PORT}"