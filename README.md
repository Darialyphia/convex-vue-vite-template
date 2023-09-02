# Vue + Vite + Convex

Template to easily use [Convex](https://www.convex.dev/) with [Vue](https://vuejs.org/) and [Auth0](https://auth0.com/)

Everything should be setup to work properly.

**This branch adds a bunch of goodies that I like to use for my vue projects and can be fairly opinionated, if you're only interested in the convex stuff, check the [minimal branch](https://github.com/loicpennequin/convex-vue-vite-template/tree/minimal)**

- A vue plugin has been created to instanciated a slightly modified version of the `ConvexReactClient`.
- If `auth0` options are provided to the plugin, navigation guards will be added to the application. You can tweak the option to have a different redirect url, or more involved way of determining if an autentication check should be made (by default, add `needsauth: true` to a [route block meta](https://github.com/posva/unplugin-vue-router#sfc-route-custom-block)).
- ⚠️ You will need to add your auth0 credentials (domain and client ID)
  - in a .env.local file under the keys `VITE_AUTH0_DOMAIN` and `VITE_AUTH0_CLIENTID`. You can use different names but will have ti make the appropriate changes in `src/main.ts`
  - as environment variables through the convex dashboard ([see here](https://docs.convex.dev/production/environment-variables)) under the keys `AUTH0_DOMAIN` and `AUTH0_APPLICATIONID`. You can use different names but will have ti make the appropriate changes in `convex/auh.config.js`
- Composables have been made to easily use the convex client. They are:
  - `useQuery`
  - `useSuspenseQuery` : like useQuery but can be awaited and will resolve once the query result is available (either from cache or from a network call). This enables you to use this composable in conjuction with Vue's [`<Suspense />`](https://vuejs.org/guide/built-ins/suspense.html). Note: like useQuery, the value will be reactive and will update automatically when it's value changes on the Convex server.
  - `usePaginatedQuery`: ⚠️ Not available yet
  - `useMutation`: ⚠️ Optimistic updates are not available yet
  - `useAction`
  - `useConvex`: if you need to use the ConvexVueClient cirectly
  - `useConvexAuth`: if you used the `auth0` option in the plugin, it will return you the loading and authenticated state. For additional auth utilities like login, logout, user etc, please use `useAuth0` from `@auth0/auth0-vue`
  - `<EnsureAuthenticated />` helper component to display things only when the user is logged in. Takes a `loading` and `fallback` slots. The default slot receives the connected user object as slot props

This branch adds a lot of other stuff for better DX and overall more batteries included

- [Auto import](https://github.com/unplugin/unplugin-auto-import) for vue, @vueuse/core, vee-validate, vue-router, as well as the `composables` and `utils` directories
- [Auto imported vue components](https://github.com/unplugin/unplugin-vue-components) in the `components` directory, as well asall components of the [Ark-ui](https://ark-ui.com/docs/vue/overview/introduction) library under the `Ark` prefix, eg. `ArkAccordion`
- [Open-props](https://open-props.style/), as well as [UnoCSS](https://unocss.dev/) for styling. A preset a custom UNO theme has been added to use open-props' values. The uno config also scans your `src/styles/theme.css` file to add additional colors, see the file for more informations
- [vee-validate](https://vee-validate.logaretm.com/v4/) for form management
- A few UI components for buttons, inputs etc...nothing fancy
- [Iconify component](https://iconify.design/docs/icon-components/vue/) (UiIcon) to easily add an icon from inconify. This can be used instead of uno's `presetIcons` when you want to be able to pass an icon name as props for example.
- [PWA Support](https://vite-pwa-org.netlify.app/). ⚠️You...might wanna make sure you replace the icons inèpublic/icons, as I wil be forever 15 years old.
- A few utility types have been added in `src/utils/types`
- A theme supporting dark mode, and a dark mode component
