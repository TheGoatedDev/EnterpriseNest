import { defineConfig } from 'tsup';

const isDev = process.env.NODE_ENV !== 'production';
const isWatch = process.argv.includes('--watch');


const tsupConfig = defineConfig({
    entry: ['src/index.ts'],
    clean: true,
    sourcemap: isDev ? 'inline' : false,
    silent: !isWatch,
    onSuccess: isWatch ? 'node dist/index.js' : undefined,
    tsconfig: 'tsconfig.json',
    format: ['esm'],
});

export default tsupConfig;
