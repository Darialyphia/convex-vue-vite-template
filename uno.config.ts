// uno.config.ts
import {
  defineConfig,
  presetUno,
  transformerVariantGroup,
  presetIcons,
  type Preset
} from 'unocss';
import { presetOpenProps } from './tools/uno-openprops-preset';

export default defineConfig({
  blocklist: ['container'],
  presets: [presetIcons(), presetUno(), presetOpenProps() as Preset<object>],
  transformers: [transformerVariantGroup()]
  // theme: {
  //   colors: {
  //     primary: 'var(--primary)'
  //   }
  // }
  // content: {
  //   filesystem: ['**/*.{html,ts,vue}']
  // }
});
