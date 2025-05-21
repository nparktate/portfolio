# make sure you are in /var/www/portfolio
cd /var/www/portfolio

cat > deploy.sh <<'EOF'
#!/usr/bin/env bash
set -e

echo "🔄  pulling…"
git pull origin main

echo "📦  npm ci…"
npm ci

echo "🏗️   building…"
npm run build          # outputs to dist/

echo "🚚  copying to /var/www/portfolio_live…"
rm -rf /var/www/portfolio_live/*                     # clear old static files
cp -R dist/* dist/.* /var/www/portfolio_live/ 2>/dev/null || true

echo "♻️   nginx reload…"
systemctl reload nginx

echo "✅  deployed."
EOF

chmod +x deploy.sh
