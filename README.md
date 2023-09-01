# Vue + Vite + Convex

Template to easily use [Convex](https://www.convex.dev/) with [Vue](https://vuejs.org/) and [Auth0](https://auth0.com/)

Everything should be setup to work properly.

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
