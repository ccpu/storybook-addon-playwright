import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { AppRouter } from './router';

const BASE = typeof window !== 'undefined' ? window.location.origin : '';

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      maxURLLength: 2083,
      url: `${BASE}/trpc`,
    }),
  ],
});
