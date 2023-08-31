import {
  BaseConvexClient,
  type QueryToken,
  type ClientOptions,
  type OptimisticUpdate
} from 'convex/browser';
import type { AuthTokenFetcher, Watch, WatchQueryOptions } from 'convex/react';
import {
  getFunctionName,
  type ArgsAndOptions,
  type FunctionReference,
  type FunctionReturnType,
  type UserIdentity,
  type FunctionArgs,
  type OptionalRestArgs,
  makeFunctionReference
} from 'convex/server';
import type { Value } from 'convex/values';
import type { InjectionKey, Plugin } from 'vue';

export type UserIdentityAttributes = Omit<UserIdentity, 'tokenIdentifier'>;

export type ConnectionState = {
  hasInflightRequests: boolean;
  isWebSocketConnected: boolean;
  timeOfOldestInflightRequest: Date | null;
};
export interface MutationOptions<Args extends Record<string, Value>> {
  optimisticUpdate?: OptimisticUpdate<Args>;
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
      throw new Error('ConvexReactClient has already been closed.');
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

      // @ts-ignore internal deez nuts
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

  /**
   * Close any network handles associated with this client and stop all subscriptions.
   *
   * Call this method when you're done with a {@link ConvexReactClient} to
   * dispose of its sockets and resources.
   *
   * @returns A `Promise` fulfilled when the connection has been completely closed.
   */
  async close(): Promise<void> {
    this.closed = true;
    // Prevent outstanding React batched updates from invoking listeners.
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

const CONVEX_INJECTION_KEY = Symbol('convex') as InjectionKey<ConvexVueClient>;

export const createConvex = (origin: string): Plugin => ({
  install(app) {
    app.provide(CONVEX_INJECTION_KEY, new ConvexVueClient(origin));
  }
});

export const useConvex = () => {
  return useSafeInject(CONVEX_INJECTION_KEY);
};

type QueryReference = FunctionReference<'query'>;
export const useQuery = <Query extends QueryReference>(
  query: Query,
  ...args: OptionalRestArgs<Query>
): Ref<Query['_returnType'] | undefined> => {
  const convex = useConvex();

  const queryReference =
    typeof query === 'string' ? makeFunctionReference<'query', any, any>(query) : query;

  const { onUpdate, localQueryResult } = convex.watchQuery(queryReference, ...args);
  const data = ref(localQueryResult());

  const unsub = onUpdate(() => {
    const newVal = localQueryResult();

    data.value = newVal;
  });

  onUnmounted(unsub);

  return data;
};

export const useSuspenseQuery = <Query extends QueryReference>(
  query: Query,
  ...args: OptionalRestArgs<Query>
): Promise<Ref<Query['_returnType']>> => {
  const convex = useConvex();

  const queryReference =
    typeof query === 'string' ? makeFunctionReference<'query', any, any>(query) : query;

  let _resolve: (val: Ref<Query['_returnType']>) => void;
  const suspense = new Promise<Ref<Query['_returnType']>>(res => {
    _resolve = res;
  });

  const { onUpdate, localQueryResult } = convex.watchQuery(queryReference, ...args);
  const data = ref(localQueryResult());

  const unsub = onUpdate(() => {
    const newVal = localQueryResult();
    data.value = newVal;
    _resolve(data);
  });

  onUnmounted(unsub);

  return suspense;
};

type MutationReference = FunctionReference<'mutation'>;
export function useMutation<Mutation extends MutationReference>(mutation: Mutation) {
  const convex = useConvex();

  const mutationReference =
    typeof mutation === 'string'
      ? makeFunctionReference<'mutation', any, any>(mutation)
      : mutation;

  return (args?: Mutation['_args']): Promise<Mutation['_returnType']> => {
    return convex.mutation(mutationReference, args, {});
  };
}
