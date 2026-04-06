import type { IncomingMessage, ServerResponse } from 'http';

export function createContext({
  req,
  res,
}: {
  req: IncomingMessage;
  res: ServerResponse;
}) {
  return { req, res };
}

export type Context = ReturnType<typeof createContext>;
