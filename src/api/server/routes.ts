import type { IncomingMessage, ServerResponse } from 'node:http';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createContext } from '../trpc/context';
import { appRouter } from '../trpc/router';

function toWebRequest(req: IncomingMessage) {
  return new Request(`http://localhost${req.url}`, {
    body: ['GET', 'HEAD'].includes(req.method ?? '')
      ? undefined
      : (req as unknown as BodyInit),
    duplex: 'half' as never,
    headers: req.headers as HeadersInit,
    method: req.method,
  } as RequestInit);
}

interface RouterLike {
  all: (
    path: string,
    handler: (req: IncomingMessage, res: ServerResponse) => Promise<void>,
  ) => void;
}

export default function middleware(router: RouterLike) {
  router.all('/trpc/*', async (req, res) => {
    const request = toWebRequest(req);

    const response = await fetchRequestHandler({
      createContext: () => createContext({ req, res }),
      endpoint: '/trpc',
      onError: ({ error, path }) => {
        console.error(`[storybook-addon-playwright] tRPC error on "${path}"`, error);
      },
      req: request,
      router: appRouter,
    });

    res.statusCode = response.status;
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    const body = await response.arrayBuffer();
    res.end(Buffer.from(body));
  });
}
