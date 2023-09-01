import type { InjectionKey, Plugin, Ref } from 'vue';
import { ConvexVueClient } from '@/utils/convex';
import type { Router } from 'vue-router/auto';
import type { RouteLocationNormalized } from 'vue-router/auto';
import type { RouteLocationRaw } from 'vue-router/auto';

export const CONVEX_INJECTION_KEY = Symbol('convex') as InjectionKey<ConvexVueClient>;

type Auth0Options =
  | {
      installNavigationGuard: true;
      needsAuth: (to: RouteLocationNormalized, from?: RouteLocationNormalized) => boolean;
      redirectTo: (
        to: RouteLocationNormalized,
        from?: RouteLocationNormalized
      ) => RouteLocationRaw;
    }
  | {
      installNavigationGuard?: false;
      needsAuth?: never;
      redirectTo?: never;
    };

type CreateConvexOptions = {
  auth0?: Auth0Options;
};

type ConvexAuthState = {
  isLoading: Readonly<Ref<boolean>>;
  isAuthenticated: Readonly<Ref<boolean>>;
};

export const CONVEX_AUTH_INJECTION_KEY = Symbol(
  'convex'
) as InjectionKey<ConvexAuthState>;

const installNavigationGuard = (
  authState: ConvexAuthState,
  router: Router,
  route: RouteLocationNormalized,
  {
    needsAuth,
    redirectTo
  }: Pick<Auth0Options & { installNavigationGuard: true }, 'needsAuth' | 'redirectTo'>
) => {
  router.beforeEach(async (to, from, next) => {
    if (!needsAuth(to, from)) return next();

    await until(authState.isLoading).not.toBe(true);

    if (!authState.isAuthenticated.value) {
      return next(redirectTo(to, from));
    }

    next();
  });

  router.isReady().then(async () => {
    if (!needsAuth(route)) return;
    await until(authState.isLoading).not.toBe(true);
    if (!authState.isAuthenticated.value) {
      return router.replace(redirectTo(route));
    }
  });
};

export const createConvex = (
  origin: string,
  options: CreateConvexOptions = {}
): Plugin => ({
  install(app) {
    const convex = new ConvexVueClient(origin);
    app.provide(CONVEX_INJECTION_KEY, convex);

    if (!options.auth0) return;
    const isConvexAuthenticated = ref(false);

    const { isAuthenticated, isLoading, getAccessTokenSilently } =
      app.config.globalProperties.$auth0;

    const fetchAccessToken = async ({
      forceRefreshToken
    }: {
      forceRefreshToken: boolean;
    }) => {
      try {
        const response = await getAccessTokenSilently({
          detailedResponse: true,
          cacheMode: forceRefreshToken ? 'off' : 'on'
        });
        return response.id_token as string;
      } catch (error) {
        return null;
      }
    };

    watchEffect(() => {
      if (isLoading.value) return;

      if (isAuthenticated.value) {
        convex.setAuth(fetchAccessToken, isAuth => {
          isConvexAuthenticated.value = isAuth;
        });
      } else {
        convex.clearAuth();
        isConvexAuthenticated.value = false;
      }
    });

    const authState = {
      isLoading: readonly(isLoading),
      isAuthenticated: readonly(isConvexAuthenticated)
    };
    app.provide(CONVEX_AUTH_INJECTION_KEY, authState);

    if (options.auth0.installNavigationGuard) {
      installNavigationGuard(
        authState,
        app.config.globalProperties.$router,
        app.config.globalProperties.$route,
        options.auth0
      );
    }
  }
});
