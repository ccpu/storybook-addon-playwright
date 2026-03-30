import { z } from 'zod';
import { router, baseProcedure } from '../../trpc/trpc';
import { getActionsSchema, getSchema } from './schema.service';

export const schemaRouter = router({
  // query: pure read, no FS write
  getActionsSchema: baseProcedure.query(() => getActionsSchema()),

  // mutation: reads + may generate schema — justified as it may have side effects
  getSchema: baseProcedure
    .input(z.object({ schemaName: z.string() }))
    .mutation(({ input }) =>
      getSchema(input.schemaName as 'browser-options' | 'screenshot-options'),
    ),
});
