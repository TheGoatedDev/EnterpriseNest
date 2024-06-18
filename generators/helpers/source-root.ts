import { PlopTypes } from '@turbo/gen';

export const addSourceRootHelper = (plop: PlopTypes.NodePlopAPI): void => {
    plop.setHelper('sourceRoot', () => {
        return '../../src';
    });
};
