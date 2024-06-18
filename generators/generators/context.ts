import { PlopTypes } from '@turbo/gen';

export const addContextGenerator = (plop: PlopTypes.NodePlopAPI): void => {
    plop.setGenerator('context', {
        description: 'Add a new context to the project',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'What is the name of the new context?',
                validate: (input: string) => {
                    if (!input) {
                        return 'context name is required';
                    }
                    return true;
                },
            },
        ],
        actions: [
            // Add a new module to the application
            {
                type: 'add',
                path: '{{ sourceRoot }}/application/{{ dashCase name }}/{{ dashCase name }}.module.ts',
                templateFile: 'templates/context/nest-module.hbs',
            },
            // Prepend the AppModule file with the new module import
            {
                type: 'modify',
                pattern: /^/,
                path: '{{ sourceRoot }}/application/app.module.ts',
                templateFile: 'templates/context/app-module-import.hbs',
            },
            // Add the new module to the AppModule imports
            {
                type: 'modify',
                path: '{{ sourceRoot }}/application/app.module.ts',
                transform: (fileContent: string, data) =>
                    fileContent.replace(
                        /(imports: \[[\s\S]*?)(\n\s*\])/,
                        plop.renderString(
                            '$1\n    {{ properCase name }}Module$2',
                            data,
                        ),
                    ),
            },
        ],
    });
};
