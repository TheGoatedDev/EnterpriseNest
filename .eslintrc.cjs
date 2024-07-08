/** @type {import("eslint").Linter.Config} */
module.exports = {
    root: true,

    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json',
    },
    settings: {
        'import/resolver': {
            typescript: {
                project: './tsconfig.json',
            },
        },
    },

    env: {
        node: true,
        jest: true,
    },

    extends: [...[
        '@vercel/style-guide/eslint/node',
        '@vercel/style-guide/eslint/typescript',
        '@vercel/style-guide/eslint/jest',
    ].map(require.resolve), 'prettier', 'plugin:@elsikora/sort-decorators/strict'],
    plugins: ['prettier', 'simple-import-sort', 'unused-imports', "@elsikora/sort-decorators"],

    rules: {
        'prettier/prettier': 'error',

        'import/order': 'off',

        '@typescript-eslint/consistent-type-imports': 'off',

        '@typescript-eslint/no-unused-vars': 'off',
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
            'warn',
            {
                vars: 'all',
                varsIgnorePattern: '^_',
                args: 'after-used',
                argsIgnorePattern: '^_',
            },
        ],
        "@typescript-eslint/no-invalid-void-type": 'warn',

        // TODO: Might need to remove this rule for strictness but otherwise it's a issue for zod
        'import/no-named-as-default-member': 'off',
        'import/no-named-as-default': 'off',

        '@typescript-eslint/explicit-function-return-type': 'off',

        'jest/expect-expect': [
            'error',
            {
                assertFunctionNames: ['expect', '**.expect'],
                additionalTestBlockFunctions: [],
            },
        ],
    },

    overrides: [
        { files: ['*.js?(x)', '*.ts?(x)'] },
        {
            files: [
                '*.module.*',
                '*.query.*',
                '*.command.*',
                '*.event.*',
                '*.handler.*',
            ],
            rules: {
                '@typescript-eslint/no-extraneous-class': 'off',
            },
        },
        {
            files: ['generators/**/*'],
            rules: {
                'prefer-named-capture-group': 'off',
                'import/no-default-export': 'off'
            },

        },

        // Tests
        {
            files: ['**/*.test.ts', '**/*.spec.ts'],
            rules: {
                "@typescript-eslint/no-unsafe-assignment": "warn",
            },

        }
    ],

    ignorePatterns: [
        'node_modules/',
        'dist/',
        '.turbo/',
        '*.config.*',
        '.eslintrc.js',
        'coverage/',
    ],
};
