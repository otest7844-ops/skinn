import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: '../../public/games/counter-siege',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
});
