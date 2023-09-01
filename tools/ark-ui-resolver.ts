import { type Resolver } from 'unplugin-auto-import/types';

export interface ModuleOptions {
  prefix: string;
}

export const ArkUiResolver: Resolver = componentName => {
  if (componentName.startsWith('Ark'))
    return { name: componentName.slice(3), from: '@ark-ui/vue' };
};
