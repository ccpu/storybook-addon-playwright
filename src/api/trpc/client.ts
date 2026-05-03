import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from './router';

const BASE = typeof window !== 'undefined' ? window.location.origin : '';

export const trpcClient = createTRPCReact<AppRouter>();

export const createTrpcHttpClient = () =>
  trpcClient.createClient({
    links: [
      httpBatchLink({
        maxURLLength: 2083,
        url: `${BASE}/trpc`,
      }),
    ],
  });
