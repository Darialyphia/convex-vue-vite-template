// uno.config.ts
import {
  defineConfig,
  presetUno,
  transformerVariantGroup,
  presetIcons,
  type Preset
} from 'unocss';
import { presetOpenProps } from './tools/uno-openprops-preset';
import fs from 'fs';
import path from 'path';
import * as csstree from 'css-tree';

const cssTheme = fs.readFileSync(path.join(__dirname, 'src/styles/theme.css'), {
  encoding: 'utf-8'
});

const ast = csstree.parse(cssTheme);
const themeColors: Record<string, string> = {};
const colorIdentifierRE = new RegExp('--color-(.+)-hsl$');

csstree.walk(ast, node => {
  if (node.type !== 'Declaration') return;
  const { property } = node;
  const match = property.match(colorIdentifierRE);
  if (match?.[1]) {
    themeColors[match[1]] = `hsl(var(${property}) / <alpha-value>)`;
  }
});

export default defineConfig({
  blocklist: ['container'],
  presets: [presetIcons(), presetUno(), presetOpenProps() as Preset<object>],
  transformers: [transformerVariantGroup()],
  theme: {
    colors: themeColors
  }

  // theme: {
  //   colors: {
  //     primary: 'var(--primary)'
  //   }
  // }
  // content: {
  //   filesystem: ['**/*.{html,ts,vue}']
  // }
});
