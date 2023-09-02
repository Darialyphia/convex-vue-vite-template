import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VueRouterAutoImports } from 'unplugin-vue-router';
import { fileURLToPath, URL } from 'node:url';
import AutoImport from 'unplugin-auto-import/vite';
import VueRouter from 'unplugin-vue-router/vite';
import Components from 'unplugin-vue-components/vite';
import { ArkUiResolver } from './tools/ark-ui-resolver';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VueRouter({
      routesFolder: fileURLToPath(new URL('./src/pages', import.meta.url)),
      dts: './typed-router.d.ts'
    }),

    vue({
      reactivityTransform: true,
      script: {
        defineModel: true
      }
    }),

    AutoImport({
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
      imports: [
        'vue',
        '@vueuse/core',
        'vee-validate',
        VueRouterAutoImports,
        {
          '@auth0/auth0-vue': ['useAuth0']
        }
      ],
      dirs: ['./src/composables/**', './src/utils/**']
    }),

    Components({
      dts: true,
      extensions: ['vue'],
      globs: ['./src/components/**/*.vue', './src/directives/**/*.ts'],
      directoryAsNamespace: false,
      resolvers: [ArkUiResolver]
    }),

    VitePWA({
      registerType: 'prompt',
      srcDir: 'src',
      filename: 'sw.ts',
      strategies: 'injectManifest',
      devOptions: {
        enabled: false,
        type: 'module'
      },
      manifest: {
        name: 'Battle arena',
        short_name: 'BA',
        description: 'GOTY fr fr',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/icon/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icon/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000
  }
});
