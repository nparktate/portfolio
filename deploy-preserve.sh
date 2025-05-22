#!/usr/bin/env bash
set -e

echo "🔄  pulling…"
git pull origin main

echo "📦  npm ci…"
npm ci

echo "🏗️   building…"
npm run build          # outputs to dist/

echo "💾  backing up clicks counter data…"
if [ -f /var/www/portfolio_live/clicks.json ]; then
  cp /var/www/portfolio_live/clicks.json /tmp/clicks.json.backup
  echo "    ✓ clicks.json backed up"
else
  echo "    ⚠ no existing clicks.json found, will create a new one"
  echo '{"clicks": 0}' > /tmp/clicks.json.backup
fi

echo "🚚  copying to /var/www/portfolio_live…"
rm -rf /var/www/portfolio_live/*                     # clear old static files
cp -R dist/* dist/.* /var/www/portfolio_live/ 2>/dev/null || true

echo "🔄  restoring clicks counter data…"
cp /tmp/clicks.json.backup /var/www/portfolio_live/clicks.json
chmod 666 /var/www/portfolio_live/clicks.json        # ensure it's writable
echo "    ✓ clicks.json restored"

echo "♻️   nginx reload…"
systemctl reload nginx

echo "✅  deployed with preserved click counter data."