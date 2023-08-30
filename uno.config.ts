// uno.config.ts
import { defineConfig, presetUno, transformerVariantGroup, presetIcons } from 'unocss';
import presetOpenProps from './tools/uno-openprops-preset';

export default defineConfig({
  blocklist: ['container'],
  presets: [presetIcons(), presetUno(), presetOpenProps() as any],
  transformers: [transformerVariantGroup()]
  // content: {
  //   filesystem: ['**/*.{html,ts,vue}']
  // }
});
