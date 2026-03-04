import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  base: './',
  build: {
    emptyOutDir: true,
    outDir: '../../landingpage',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
