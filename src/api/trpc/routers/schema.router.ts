import { z } from 'zod';
import { router, baseProcedure } from '../trpc';
import { getActionsSchema } from '../../services/get-actions-schema';
import { getClientConfig } from '../../services/get-client-config';
import { getSchemaService as getSchema } from '../../services/get-schema-service';

export const schemaRouter = router({
  // query: pure read, no FS write
  getActionsSchema: baseProcedure.query(() => getActionsSchema()),

  // query: pure read, no side effects
  getClientConfig: baseProcedure.query(() => getClientConfig()),

  // mutation: reads + may generate schema — justified as it may have side effects
  getSchema: baseProcedure
    .input(z.object({ schemaName: z.string() }))
    .mutation(({ input }) =>
      getSchema(input.schemaName as 'browser-options' | 'screenshot-options'),
    ),
});
