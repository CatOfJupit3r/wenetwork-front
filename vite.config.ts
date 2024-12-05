import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
    base: '/',
    plugins: [
        react(),
        dts({
            tsconfigPath: 'tsconfig.build.json',
        }),
        tsconfigPaths(),
    ],
});
