import { PlopTypes } from '@turbo/gen';

import { addContextGenerator } from './generators/context';
import { addSourceRootHelper } from './helpers/source-root';
import { addContextSelector } from './prompts/context-selector';

export default function generator(plop: PlopTypes.NodePlopAPI): void {
    plop.setWelcomeMessage('Welcome to Enterprise Nest! 🚀');

    addSourceRootHelper(plop);
    addContextSelector(plop);

    addContextGenerator(plop);
}
