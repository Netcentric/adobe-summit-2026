import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './',
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/scss/_mixins.scss";
        `
      }
    }
  },
  build: {
    emptyOutDir: true,
    outDir: '../../portfolio-agent',
  },
  server: {
    proxy: {
      '/portfolio-agent': {
        target: 'https://main--adobe-summit-2026--netcentric.aem.live',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api-portfolio/, ''),
      },
      '^/media_': {
        target: 'https://main--adobe-summit-2026--netcentric.aem.live/portfolio-agent',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
});
