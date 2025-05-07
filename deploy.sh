#!/bin/bash

# Deployment script for portfolio website

# Navigate to the portfolio directory
cd /var/www/portfolio && \

# Pull the latest changes from git
git pull && \

# Reload nginx to apply changes
systemctl reload nginx

# Output success message
echo "Portfolio site updated successfully!"