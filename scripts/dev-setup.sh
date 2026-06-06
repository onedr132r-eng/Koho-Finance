#!/usr/bin/env bash
set -e

echo "==> Checking prerequisites..."
command -v node >/dev/null 2>&1 || { echo "Node.js is required. Install from https://nodejs.org"; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo "Installing pnpm..."; npm install -g pnpm; }
command -v psql >/dev/null 2>&1 || { echo "PostgreSQL is required. Install from https://postgresql.org/download"; exit 1; }

echo "==> Installing dependencies..."
pnpm install

echo "==> Setting up database..."
DB_URL="${DATABASE_URL:-postgresql://localhost/koho}"
DB_NAME=$(echo "$DB_URL" | sed 's/.*\///')

# Create DB if it doesn't exist
createdb "$DB_NAME" 2>/dev/null || true

echo "==> Loading schema and seed data..."
psql "$DB_URL" < scripts/seed.sql

echo ""
echo "==> All done! Now open two terminals and run:"
echo ""
echo "  Terminal 1 (API):      DATABASE_URL=$DB_URL PORT=3001 pnpm --filter @workspace/api-server run dev"
echo "  Terminal 2 (Frontend): PORT=5173 BASE_PATH=/ pnpm --filter @workspace/koho run dev"
echo ""
echo "  Then open: http://localhost:5173"
echo ""
