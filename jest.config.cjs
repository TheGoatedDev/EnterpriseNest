/** @type {import('jest').Config} */
const config = {
    verbose: true,
    testEnvironment: 'node',
    transform: {
        '^.+\\.tsx?$': [
            '@swc/jest',
            {
                jsc: {
                    target: 'es2022',
                    parser: {
                        syntax: 'typescript',
                        decorators: true,
                    },

                    transform: {
                        legacyDecorator: true,
                        decoratorMetadata: true,
                    },
                },
            },
        ],
    },
    transformIgnorePatterns: ['node_modules'],
    testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
};

module.exports = config;
