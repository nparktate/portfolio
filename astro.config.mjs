// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [],
  markdown: {
    render: [
      '@astrojs/markdown-remark',
      {
        remarkPlugins: [],
        rehypePlugins: [],
        remarkRehype: { allowDangerousHtml: true }
      }
    ]
  }
});