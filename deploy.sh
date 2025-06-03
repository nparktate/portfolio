#!/usr/bin/env bash
set -e

echo "🔄  pulling…"
git pull origin main

echo "📦  npm ci…"
npm ci

echo "🏗️   building…"
npm run build          # outputs to out/

echo "🚚  copying to /var/www/portfolio_live…"
rm -rf /var/www/portfolio_live/*                     # clear old static files
cp -R out/* out/.* /var/www/portfolio_live/ 2>/dev/null || true

echo "♻️   nginx reload…"
systemctl reload nginx

echo "✅  deployed."