import { PlopTypes } from '@turbo/gen';

import { addContextGenerator } from './generators/context';
import { addSourceRootHelper } from './helpers/source-root';

export default function generator(plop: PlopTypes.NodePlopAPI): void {
    plop.setWelcomeMessage('Welcome to Enterprise Nest! 🚀');

    addSourceRootHelper(plop);

    addContextGenerator(plop);
}
