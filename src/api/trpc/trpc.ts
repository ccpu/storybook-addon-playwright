import { initTRPC } from '@trpc/server';
import type { Context } from './context';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const baseProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;
