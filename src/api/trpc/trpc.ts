import type { Context } from './context';
import { initTRPC } from '@trpc/server';

const t = initTRPC.context<Context>().create();

export const { router } = t;
export const baseProcedure = t.procedure;
export const { createCallerFactory } = t;
