#!/bin/bash
<<<<<<< HEAD

# Deployment script for portfolio website

# Navigate to the portfolio directory
cd /var/www/portfolio && \

# Pull the latest changes from git
git pull && \

# Reload nginx to apply changes
systemctl reload nginx

# Output success message
echo "Portfolio site updated successfully!"
=======
set -e

cd /var/www/portfolio || exit 1

# 1. Pull latest code
git pull origin main

# 2. Install / update node modules
npm ci         # fast, reproducible

# 3. Build Astro (creates dist/)
npm run build

# 4. Copy fresh static files into web root
find . -maxdepth 1 -type f -not -name 'deploy.sh' -not -name '.git*' -exec rm -f {} \;
find . -maxdepth 1 -type d -not -name 'dist' -not -name '.git' -not -name 'node_modules' -not -name '.' -exec rm -rf {} \;

cp -R dist/* dist/.* . 2>/dev/null || true   # bring dist contents up one level
rm -rf dist                                  # optional: clean up build folder

# 5. Reload Nginx (safe even if config unchanged)
systemctl reload nginx

echo "✅ Portfolio built & deployed."
>>>>>>> 3bb7b1a (1)
