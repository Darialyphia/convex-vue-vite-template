import type { Ref } from 'vue';

export type ConvexAuthState = {
  isLoading: Readonly<Ref<boolean>>;
  isAuthenticated: Readonly<Ref<boolean>>;
};

const CONVEX_AUTH_INJECTION_KEY = Symbol('convex') as InjectionKey<ConvexAuthState>;

export const useConvexAuth0Provider = () => {
  const isConvexAuthenticated = ref(false);

  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const convex = useConvex();

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

  const api = {
    isLoading: readonly(isLoading),
    isAuthenticated: readonly(isAuthenticated)
  };
  provide(CONVEX_AUTH_INJECTION_KEY, api);

  return api;
};

export const useConvexAuth = () => {
  return useSafeInject(CONVEX_AUTH_INJECTION_KEY);
};
