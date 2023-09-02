import { CONVEX_INJECTION_KEY, CONVEX_AUTH_INJECTION_KEY } from '@/plugins/convex';
import { useSafeInject } from '../useSafeInject';

export const useConvex = () => {
  return useSafeInject(CONVEX_INJECTION_KEY);
};

export const useConvexAuth = () => {
  return useSafeInject(CONVEX_AUTH_INJECTION_KEY);
};
