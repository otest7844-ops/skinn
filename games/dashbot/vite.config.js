import {defineConfig} from 'vite'
import {svelte} from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr';
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

const sourceDirectory = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    base: './',
    build: {
        outDir: resolve(sourceDirectory, '../../public/games/dashbot'),
        emptyOutDir: true,
    },
    css: {
        postcss: {plugins: []},
    },
    plugins: [
        svelte(),
        tailwindcss(),
        svgr({
            exportAsDefault: true, // 放这里就对了
        }),
    ],
})
