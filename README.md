# Vue + Vite + Convex

Template to easily use [Convex](https://www.convex.dev/) with [Vue](https://vuejs.org/) and [Auth0](https://auth0.com/)

Everything should be setup to work properly.

**This branch adds a bunch of goodies that I like to use for my vue projects and can be fairly opinionated, if you're only interested in the convex stuff, check the [minimal branch](https://github.com/loicpennequin/convex-vue-vite-template/tree/minimal)**

- A `createConvex` vue plugin has been created to instanciated a slightly modified version of the `ConvexReactClient`.
- If `auth0` options are provided to the plugin, navigation guards will be added to the application. You can tweak the option to have a different redirect url, or more involved way of determining if an autentication check should be made (by default, add `needsauth: true` to a [route block meta](https://github.com/posva/unplugin-vue-router#sfc-route-custom-block)).
- ⚠️ You will need to add your auth0 credentials (domain and client ID)
  - in a .env.local file under the keys `VITE_AUTH0_DOMAIN` and `VITE_AUTH0_CLIENTID`. You can use different names but will have ti make the appropriate changes in `src/main.ts`
  - as environment variables through the convex dashboard ([see here](https://docs.convex.dev/production/environment-variables)) under the keys `AUTH0_DOMAIN` and `AUTH0_APPLICATIONID`. You can use different names but will have ti make the appropriate changes in `convex/auh.config.js`

🧪 - Experimental: might have bugs
🔨 - Available soon

## Composables

### `useQuery`

```html
<script setup lang="ts">
  import { useQuery } from '@/composables/convex';
  import { api } from '@/api';

  const messages = useQuery(api.messages.list);
</script>

<template>
  <ul v-if="messages">
    <li v-for="message in messages" :key="message._id">{{message.text}}</li>
  </ul>
</template>
```

### `useSuspenseQuery`

like useQuery but can be awaited and will resolve once the query result is available (either from cache or from a network call). This enables you to use this composable in conjuction with Vue's [`<Suspense />`](https://vuejs.org/guide/built-ins/suspense.html). Note: like useQuery, the value will be reactive and will update automatically when it's value changes on the Convex server.

```html
<script setup lang="ts">
  import { useQuery } from '@/composables/convex';
  import { api } from '@/api';

  const messages = await useSuspenseQuery(api.messages.list);
</script>

<template>
  <!-- don't forget to add a <Suspense> in the parent component ! -->
  <ul>
    <li v-for="message in messages" :key="message._id">{{message.text}}</li>
  </ul>
</template>
```

### 🧪`usePaginatedQuery`

```html
<script setup lang="ts">
  import { api } from '@/api';
  import { usePaginatedQuery } from '@/composables/convex';

  const ITEMS_PER_PAGE = 5;
  const {
    results: messages,
    status,
    loadMore
  } = usePaginatedQuery(
    api.messages.paginatedList,
    {},
    { initialNumItems: ITEMS_PER_PAGE }
  );
</script>

<template>
  <ul>
    <li v-for="message in messages" :key="message._id">{{message.text}}</li>
  </ul>

  <button :disabled="status !== 'CanLoadMore'" @click="loadMore(ITEMS_PER_PAGE)">
    Load more
  </button>
</template>
```

### `useMutation`

Now with optimistic updates ! (🧪)

```html
<script setup lang="ts">
  import { api } from '@/api';
  import { useMutation } from '@/composables/convex';
  import { reactive } from 'vue';

  const { isLoading, mutate: addMessage } = useMutation(api.messages.add, {
    optimisticUpdate: (localStore, args) => {
      const currentValue = localStore.getQuery(api.messages.list, {});
      if (currentValue === undefined) return;

      localStore.setQuery(
        api.messages.list,
        {},
        currentValue.concat({
          _id: 'optimistic' as Id<'todos'>,
          _creationTime: Date.now(),
          text: args.text
        })
      );
    }
  });

  const form = reactive({
    text: ''
  });

  const onSubmit = async () => {
    await addMessage(form);
    form.text = '';
  };
</script>

<template>
  <form @submit.prevent="onSubmit">
    <label for="text">Write a new message</label>
    <input id="text" v-model="form.text" />
    <button :disabled="isLoading">Add todo</button>
  </form>
</template>
```

### `useAction`

```html
<script setup lang="ts">
  import { api } from '@/api';
  import { useAction } from '@/composables/convex';

  const { isLoading, execute } = useAction(api.some.actio);
</script>

<template>
  <button :disables="isLoading" @click="execute()">Do the action thingie</button>
</template>
```

### `useConvex`

if you need to use the ConvexVueClient directly. You probably don't need it.

### `useConvexAuth`

if you used the `auth0` option in the plugin, it will return you the loading and authenticated state. For additional auth utilities like login, logout, user etc, please use `useAuth0` from `@auth0/auth0-vue`

```html
<script setup lang="html">
  const { isLoading, isAuthenticated } = useConvexAuth()
</script>
```

## Components

### `<EnsureAuthenticated />`

Allows you to display content depending on convex Auth status. ⚠️ you need the autho0 options in the convexPlugin for this component to work.
It accepts the following slots:

- default: when the user is logged in
- fallback: when the user isn't logged in
- loading: when the authentication process is pending

```html
<script setup lang="ts">
  import { useAuth0 } from '@auth0/auth0-vue';

  const { loginWithRedirect } = useAuth0();
</script>

<template>
  <EnsureAuthenticated>
    <template #loading>Authenticating...</template>

    <template #fallback>
      You need to be logged in to see this content
      <button @click="loginWithRedirect()">Login</button>
    </template>

    <template #default="{ user }">Welcome back, {{ user.nickname }} !</template>
  </EnsureAuthenticated>
</template>
```

### `<Query />`

Allows you to display different UI during the lifecycle of a convex query.
It takes the following props

- `query`: a function taking the convex api as a parameter and returning a query, eg: `:query="api => api.messages.list"`
- `args`: the arguments for the returned query

It accepts the following slots:

- default: should be used to display the query results (avaiable via [scoped slots](https://vuejs.org/guide/components/slots.html#scoped-slots))
- loading: pending state when the query is loading for the first time
- error: should be used to displau an error UI. It takes the error as slot props, as well as a `clearError` function to clear the underlying error b boundary (note: doing so will retry the query).

It will also emit the error when / if it happens.

```html
<script setup lang="ts">
  const handleError = (err: Error) => sendErrorToAnalytics(err);
</script>

<Query :query="api => api.messages.list" :arg="{ sentBy: 'Bob'}" @error="handleError">
  <template #loading>Loading messages...</template>

  <template #error="{ error, clearError}">
    An error has occured
    <pre>{{ error }}</pre>
    <button @click="clearError">Retry</button>
  </template>

  <template #default="{ data: messages }">
    <ChatWidget :messages="messages">
  </template>
</Query>
```

### 🧪 `<PaginatedQuery />`

Similar to `<Query />`, but handles pagination

```html
<script setup lang="ts">
  const ITEMS_PER_PAGE = 5;
</script>

<template>
  <PaginatedQuery
    v-slot="{ data: todos, status, loadMore }"
    :num-items="ITEMS_PER_PAGE"
    :query="api => api.messages.paginatedList"
    :args="{}"
  >
    <template #loading>Loading messages...</template>

    <template #error="{ error, clearError}">
      An error has occured
      <pre>{{ error }}</pre>
      <button @click="clearError">Retry</button>
    </template>

    <template #default="{ data: messages, status, loadMore }">
      <p v-if="!messages.length">No todos yet !</p>

      <ul>
        <li v-for="message in messages" :key="message._id">{{message.text}}</li>
      </ul>

      <UiButton :disabled="status !== 'CanLoadMore'" @click="loadMore(ITEMS_PER_PAGE)">
        Load more
      </UiButton>
    </template>
  </PaginatedQuery>
</template>
```

## Additional features

This branch adds a lot of other stuff for better DX and is overall more batteries included. It's fairly opinionated so if you just want to use convex with vue check out the `minimal` branch

- [Auto import](https://github.com/unplugin/unplugin-auto-import) for vue, @vueuse/core, vee-validate, vue-router, as well as the `composables` and `utils` directories
- [Auto imported vue components](https://github.com/unplugin/unplugin-vue-components) in the `components` directory, as well asall components of the [Ark-ui](https://ark-ui.com/docs/vue/overview/introduction) library under the `Ark` prefix, eg. `ArkAccordion`
- [Open-props](https://open-props.style/), as well as [UnoCSS](https://unocss.dev/) for styling. A preset a custom UNO theme has been added to use open-props' values. The uno config also scans your `src/styles/theme.css` file to add additional colors, see the file for more informations
- [vee-validate](https://vee-validate.logaretm.com/v4/) for form management
- A few UI components for buttons, inputs etc...nothing fancy
- [Iconify component](https://iconify.design/docs/icon-components/vue/) (UiIcon) to easily add an icon from inconify. This can be used instead of uno's `presetIcons` when you want to be able to pass an icon name as props for example.
- [PWA Support](https://vite-pwa-org.netlify.app/). ⚠️You...might wanna make sure you replace the icons inèpublic/icons, as I wil be forever 15 years old.
- A few utility types have been added in `src/utils/types`
- A theme supporting dark mode, and a dark mode component
