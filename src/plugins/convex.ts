import type { App, InjectionKey, Plugin, Ref } from 'vue';
import type { Router } from 'vue-router/auto';
import type { RouteLocationNormalized } from 'vue-router/auto';
import type { RouteLocationRaw } from 'vue-router/auto';
import {
  BaseConvexClient,
  type QueryToken,
  type ClientOptions,
  type OptimisticUpdate,
  type QueryJournal
} from 'convex/browser';
import type { AuthTokenFetcher } from 'convex/react';
import {
  getFunctionName,
  type ArgsAndOptions,
  type FunctionReference,
  type FunctionReturnType,
  type UserIdentity,
  type FunctionArgs,
  type OptionalRestArgs
} from 'convex/server';
import type { Value } from 'convex/values';

export type UserIdentityAttributes = Omit<UserIdentity, 'tokenIdentifier'>;

export type ConnectionState = {
  hasInflightRequests: boolean;
  isWebSocketConnected: boolean;
  timeOfOldestInflightRequest: Date | null;
};

export interface MutationOptions<Args extends Record<string, Value>> {
  optimisticUpdate?: OptimisticUpdate<Args>;
}

export interface Watch<T> {
  onUpdate(callback: () => void): () => void;
  localQueryResult(): T | undefined;
  localQueryLogs(): string[] | undefined;
  journal(): QueryJournal | undefined;
}

export interface WatchQueryOptions {
  journal?: QueryJournal;
}

export class ConvexVueClient {
  private address: string;
  private cachedSync?: BaseConvexClient;
  private listeners: Map<QueryToken, Set<() => void>>;
  private options: ClientOptions;
  private closed = false;

  private adminAuth?: string;
  private fakeUserIdentity?: UserIdentityAttributes;

  constructor(address: string, options?: ClientOptions) {
    if (typeof address !== 'string') {
      throw new Error(
        "ConvexReactClient requires a URL like 'https://happy-otter-123.convex.cloud'."
      );
    }
    if (!address.includes('://')) {
      throw new Error('Provided address was not an absolute URL.');
    }
    this.address = address;
    this.listeners = new Map();
    this.options = { ...options };
  }

  get sync() {
    if (this.closed) {
      throw new Error('ConvexReactClient has already been closed.');
    }
    if (this.cachedSync) {
      return this.cachedSync;
    }
    this.cachedSync = new BaseConvexClient(
      this.address,
      updatedQueries => this.transition(updatedQueries),
      this.options
    );
    if (this.adminAuth) {
      // @ts-ignore internal deez nuts
      this.cachedSync.setAdminAuth(this.adminAuth, this.fakeUserIdentity);
    }
    return this.cachedSync;
  }

  setAuth(fetchToken: AuthTokenFetcher, onChange?: (isAuthenticated: boolean) => void) {
    if (typeof fetchToken === 'string') {
      throw new Error(
        'Passing a string to ConvexVueClient.setAuth is no longer supported, ' +
          'please upgrade to passing in an async function to handle reauthentication.'
      );
    }
    this.sync.setAuth(
      fetchToken,
      onChange ??
        (() => {
          // Do nothing
        })
    );
  }

  clearAuth() {
    this.sync.clearAuth();
  }

  setAdminAuth(token: string, identity?: UserIdentityAttributes) {
    this.adminAuth = token;
    this.fakeUserIdentity = identity;
    if (this.closed) {
      throw new Error('ConvexVueClient has already been closed.');
    }
    if (this.cachedSync) {
      // @ts-ignore internal deez nuts
      this.sync.setAdminAuth(token, identity);
    }
  }

  watchQuery<Query extends FunctionReference<'query'>>(
    query: Query,
    ...argsAndOptions: ArgsAndOptions<Query, WatchQueryOptions>
  ): Watch<FunctionReturnType<Query>> {
    const [args, options] = argsAndOptions;
    const name = getFunctionName(query);

    return {
      onUpdate: callback => {
        const { queryToken, unsubscribe } = this.sync.subscribe(
          name as string,
          args,
          options
        );

        const currentListeners = this.listeners.get(queryToken);
        if (currentListeners !== undefined) {
          currentListeners.add(callback);
        } else {
          this.listeners.set(queryToken, new Set([callback]));
        }

        return () => {
          if (this.closed) {
            return;
          }

          const currentListeners = this.listeners.get(queryToken)!;
          currentListeners.delete(callback);
          if (currentListeners.size === 0) {
            this.listeners.delete(queryToken);
          }
          unsubscribe();
        };
      },

      localQueryResult: () => {
        // Use the cached client because we can't have a query result if we don't
        // even have a client yet!
        if (this.cachedSync) {
          return this.cachedSync.localQueryResult(name, args);
        }
        return undefined;
      },

      localQueryLogs: () => {
        if (this.cachedSync) {
          // @ts-ignore internal deez nuts
          return this.cachedSync.localQueryLogs(name, args);
        }
        return undefined;
      },

      journal: () => {
        if (this.cachedSync) {
          return this.cachedSync.queryJournal(name, args);
        }
        return undefined;
      }
    };
  }

  mutation<Mutation extends FunctionReference<'mutation'>>(
    mutation: Mutation,
    ...argsAndOptions: ArgsAndOptions<Mutation, MutationOptions<FunctionArgs<Mutation>>>
  ): Promise<FunctionReturnType<Mutation>> {
    const [args, options] = argsAndOptions;
    const name = getFunctionName(mutation);
    return this.sync.mutation(name, args, options);
  }

  action<Action extends FunctionReference<'action'>>(
    action: Action,
    ...args: OptionalRestArgs<Action>
  ): Promise<FunctionReturnType<Action>> {
    const name = getFunctionName(action);
    return this.sync.action(name, ...args);
  }

  query<Query extends FunctionReference<'query'>>(
    query: Query,
    ...args: OptionalRestArgs<Query>
  ): Promise<FunctionReturnType<Query>> {
    const watch = this.watchQuery(query, ...args);
    const existingResult = watch.localQueryResult();
    if (existingResult !== undefined) {
      return existingResult;
    }
    return new Promise(resolve => {
      const unsubscribe = watch.onUpdate(() => {
        unsubscribe();
        resolve(watch.localQueryResult());
      });
    });
  }

  connectionState(): ConnectionState {
    return this.sync.connectionState();
  }

  async close(): Promise<void> {
    this.closed = true;
    this.listeners = new Map();
    if (this.cachedSync) {
      const sync = this.cachedSync;
      this.cachedSync = undefined;
      await sync.close();
    }
  }

  private transition(updatedQueries: QueryToken[]) {
    for (const queryToken of updatedQueries) {
      const callbacks = this.listeners.get(queryToken);
      if (callbacks) {
        for (const callback of callbacks) {
          callback();
        }
      }
    }
  }
}

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
};

const setupAuth0 = (app: App, convex: ConvexVueClient, options: Auth0Options) => {
  const { isAuthenticated, isLoading, getAccessTokenSilently } =
    app.config.globalProperties.$auth0;

  const isConvexAuthenticated = ref(false);
  const isConvexAuthLoading = ref(isLoading.value);

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

  const syncConvexAuthWithAuth0Auth = () => {
    if (!isConvexAuthLoading.value && isLoading.value) {
      isConvexAuthLoading.value = true;
    }

    if (isLoading.value) return;
    if (isAuthenticated.value) {
      convex.setAuth(fetchAccessToken, isAuth => {
        isConvexAuthenticated.value = isAuth;
        isConvexAuthLoading.value = false;
      });
    } else {
      convex.clearAuth();
      isConvexAuthenticated.value = false;
      isConvexAuthLoading.value = false;
    }
  };

  watchEffect(syncConvexAuthWithAuth0Auth);

  const authState = {
    isLoading: readonly(isConvexAuthLoading),
    isAuthenticated: readonly(isConvexAuthenticated)
  };
  app.provide(CONVEX_AUTH_INJECTION_KEY, authState);

  if (options.installNavigationGuard) {
    installNavigationGuard(authState, app.config.globalProperties.$router, options);
  }
};

export const createConvex = (
  origin: string,
  options: CreateConvexOptions = {}
): Plugin => ({
  install(app) {
    const convex = new ConvexVueClient(origin);
    app.provide(CONVEX_INJECTION_KEY, convex);

    if (options.auth0) {
      setupAuth0(app, convex, options.auth0);
    }
  }
});
