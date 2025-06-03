# Nicholas Park - Motion Designer Portfolio

A modern, responsive portfolio website showcasing motion design and creative technology work. Built with Next.js and Tailwind CSS for optimal performance and developer experience.

## Overview

Single-page portfolio featuring:
- **Hero video reel** with autoplay and intersection observer
- **Professional timeline** with detailed work experience
- **Project showcase** highlighting major clients (HBO, Nike, Universal Music Group)
- **Contact information** and availability status

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Fonts**: Inter (sans-serif) & JetBrains Mono (monospace)
- **Deployment**: Static export for VPS hosting

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## Building & Deployment

```bash
# Build for production (static export)
npm run build

# Preview production build locally
npm run start
```

### VPS Deployment

The included `deploy.sh` script automates deployment to your VPS:

```bash
# Make deploy script executable
chmod +x deploy.sh

# Deploy to production
./deploy.sh
```

**Deploy Script Process:**
1. Pull latest changes from git
2. Install dependencies with `npm ci`
3. Build static export to `out/` directory
4. Copy files to `/var/www/portfolio_live/`
5. Reload nginx

## Project Structure

```
portfolio/
├── app/
│   ├── globals.css          # Tailwind CSS imports
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Main portfolio page
├── public/
│   └── reel-2023-nicholas-park.mp4  # Hero video (Git LFS)
├── deploy.sh                # Production deployment script
└── next.config.js           # Next.js configuration
```

## Key Features

### Video Integration
- Autoplay hero video with intersection observer
- Responsive video player with fallback
- Proper video pause/play on scroll

### Performance Optimizations
- Static site generation for fast loading
- Optimized fonts with preload
- Responsive images and layouts
- Clean semantic HTML structure

### Professional Design
- Monospace typography for technical aesthetic
- Precise grid system using Tailwind
- Smooth animations and transitions
- Professional color palette

## Video File Management

The portfolio video is stored using Git LFS due to file size (191MB):

```bash
# Track video files with LFS
git lfs track "*.mp4"
git add .gitattributes
git add public/reel-2023-nicholas-park.mp4
git commit -m "Add video with LFS"
git push origin main
```

## Portfolio Content

### Experience Highlights
- **Warner Bros. Discovery**: Motion Designer (2020-Present)
- **NIKE**: VFX Director (Contract, 2023)
- **Universal Music Group**: Motion Graphics Artist (2021-2022)

### Key Metrics
- 21M+ video views across projects
- 50+ shows and podcasts
- 2M+ AR filter interactions
- 5+ years professional experience

## Contact Information

- **Email**: nparktate@gmail.com
- **Phone**: (401) 241-3241
- **LinkedIn**: linkedin.com/in/linkparkdesign
- **Location**: Los Angeles, CA

---

**Portfolio v10.0** • Built with Next.js • Deployed via static export