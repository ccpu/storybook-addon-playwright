import { createTRPCMsw, httpLink } from 'msw-trpc';
import type { AppRouter } from '../src/api/trpc/router';

const trpcBaseUrl =
  typeof window !== 'undefined' && window.location?.origin
    ? `${window.location.origin}/trpc`
    : 'http://localhost/trpc';

export const trpcMswBatch = createTRPCMsw<AppRouter>({
  links: [httpLink({ url: trpcBaseUrl })],
});

export const unwrapBatchInput = <T>(input: unknown): T => {
  if (input && typeof input === 'object' && '0' in (input as object)) {
    return (input as Record<string, T>)['0'];
  }

  return input as T;
};
