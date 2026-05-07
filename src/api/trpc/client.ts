import type { AppRouter } from './router';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';

const BASE = typeof window !== 'undefined' ? window.location.origin : '';

export const trpcClient = createTRPCReact<AppRouter>();

export function createTrpcHttpClient() {
  return trpcClient.createClient({
    links: [
      httpBatchLink({
        maxURLLength: 2083,
        url: `${BASE}/trpc`,
      }),
    ],
  });
}
