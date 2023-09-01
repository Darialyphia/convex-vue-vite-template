import { CONVEX_AUTH_INJECTION_KEY } from '@/plugins/convex';

export const useConvexAuth = () => {
  return useSafeInject(CONVEX_AUTH_INJECTION_KEY);
};
