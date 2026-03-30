import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './router';

const BASE = typeof window !== 'undefined' ? window.location.origin : '';

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${BASE}/trpc`,
      maxURLLength: 2083,
    }),
  ],
});
