import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './',
  server: {
    proxy: {
      '/portfolio-agent': {
        target: 'https://main--adobe-summit-2026--netcentric.aem.live',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api-portfolio/, ''),
      },
    },
  },
});
