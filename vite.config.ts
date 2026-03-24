/**
 * @format
 */
import legacy from '@vitejs/plugin-legacy';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import {defineConfig} from 'vitest/config';

const isVitest = Boolean(process.env.VITEST);

// https://vite.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    plugins: [
        react(),
        tailwindcss(),
        ...(isVitest
            ? []
            : [
                  legacy({
                      // 浏览器范围见 package.json 的 browserslist；按需注入 core-js 垫片 + SystemJS legacy 分包
                      modernPolyfills: false
                  })
              ])
    ],
    test: {
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.ts'],
        include: ['src/**/*.{test,spec}.{ts,tsx}'],
        css: true
    }
});
