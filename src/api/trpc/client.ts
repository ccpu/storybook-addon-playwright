import type { AppRouter } from './router';
import { httpBatchStreamLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';

const BASE = typeof window !== 'undefined' ? window.location.origin : '';

export const trpcClient = createTRPCReact<AppRouter>();

export function createTrpcHttpClient() {
  return trpcClient.createClient({
    links: [
      httpBatchStreamLink({
        maxURLLength: 2083,
        streamHeader: 'accept',
        url: `${BASE}/__storybook_playwright/trpc`,
      }),
    ],
  });
}
