// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssMinify: 'lightningcss',
      minify: true,
      assetsInlineLimit: 4096, // 4kb
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['gsap']
          }
        }
      }
    },
    css: {
      devSourcemap: false
    },
    ssr: {
      noExternal: ['gsap']
    }
  },
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto'
  },
  integrations: [],
  markdown: {
    remarkPlugins: [],
    rehypePlugins: [],
    remarkRehype: { allowDangerousHtml: true }
  }
});