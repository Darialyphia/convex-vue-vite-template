# Vue + Vite + Convex

Template to easily use [Convex](https://www.convex.dev/) with [Vue](https://vuejs.org/) and [Auth0](https://auth0.com/)

Everything should be setup to work properly.

- A `createConvex` vue plugin has been created to instanciated a slightly modified version of the `ConvexReactClient`.
- If `auth0` options are provided to the plugin, navigation guards will be added to the application. You can tweak the option to have a different redirect url, or more involved way of determining if an autentication check should be made (by default, add `needsauth: true` to a [route block meta](https://github.com/posva/unplugin-vue-router#sfc-route-custom-block)).
- ⚠️ You will need to add your auth0 credentials (domain and client ID)
  - in a .env.local file under the keys `VITE_AUTH0_DOMAIN` and `VITE_AUTH0_CLIENTID`. You can use different names but will have ti make the appropriate changes in `src/main.ts`
  - as environment variables through the convex dashboard ([see here](https://docs.convex.dev/production/environment-variables)) under the keys `AUTH0_DOMAIN` and `AUTH0_APPLICATIONID`. You can use different names but will have ti make the appropriate changes in `convex/auh.config.js`

🧪 - Experimental: might have bugs
🔨 - Available soon

## Composables

### `useQuery`

### `useSuspenseQuery`

like useQuery but can be awaited and will resolve once the query result is available (either from cache or from a network call). This enables you to use this composable in conjuction with Vue's [`<Suspense />`](https://vuejs.org/guide/built-ins/suspense.html). Note: like useQuery, the value will be reactive and will update automatically when it's value changes on the Convex server.

### 🧪`usePaginatedQuery`

### `useMutation`

Now with optimistic updates ! (🧪)

### `useAction`

### `useConvex`

if you need to use the ConvexVueClient directly

### `useConvexAuth`

if you used the `auth0` option in the plugin, it will return you the loading and authenticated state. For additional auth utilities like login, logout, user etc, please use `useAuth0` from `@auth0/auth0-vue`

## Components

### `<EnsureAuthenticated />`

Allows you to display content depending on convex Auth status. ⚠️ you need the autho0 options in the convexPlugin for this component to work.
It accepts the following slots:

- default: when the user is logged in
- fallback: when the user isn't logged in
- loading: when the authentication process is pending

### `<Query />`

Allows you to display different UI during the lifecycle of a convex query.
It takes the following props

- `query`: a function taking the convex api as a parameter and returning a query, eg: `:query="api => api.messages.list"`
- `args`: the arguments for the returned query

It accepts the following slots:

- default: should be used to display the query results (avaiable via [scoped slots](https://vuejs.org/guide/components/slots.html#scoped-slots))
- loading: pending state when the query is loading for the first time
- error: should be used to displau an error UI. It takes the error as slot props, as well as a `clearError` function to clear the underlying error b boundary (note: doing so will retry the query).

It will also emit the error when / if it happens

### 🔨 `<PaginatedQuery />`

Yo Gimme a minute
