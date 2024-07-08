import { defineConfig } from 'tsup';

const isDev = process.env.NODE_ENV !== 'production';
const isWatch = process.argv.includes('--watch');


const tsupConfig = defineConfig({
    entry: ['src/index.ts'],
    clean: true,
    sourcemap: isDev ? 'inline' : false,
    silent: !isWatch,
    watch: isWatch ? ['src', '.env'] : false,
    onSuccess: isWatch ? 'node dist/index.js' : undefined,
    tsconfig: 'tsconfig.json',
    minify: isDev ? false : "terser",
    treeshake: true,
    terserOptions: {
        keep_classnames: true,
        compress: true

    }
})

export default tsupConfig;
