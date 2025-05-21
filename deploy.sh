cat > deploy.sh <<'EOF'
#!/usr/bin/env bash
set -e

echo "🔄  Updating repo…"
git pull origin main

echo "📦  Installing/Updating node modules…"
npm ci

echo "🏗️   Building Astro…"
npm run build        # outputs to dist/

echo "🚚  Publishing static files…"
find . -maxdepth 1 -type f ! -name 'deploy.sh' ! -name '.git*' -exec rm -f {} \;
find . -maxdepth 1 -type d ! -name 'dist' ! -name '.git' ! -name 'node_modules' ! -name '.' -exec rm -rf {} \;

cp -R dist/* dist/.* . 2>/dev/null || true
rm -rf dist            # optional cleanup

echo "♻️   Reloading Nginx…"
systemctl reload nginx

echo "✅  Deployed!"
EOF

chmod +x deploy.sh
