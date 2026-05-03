import {
  getActionsSchema,
  getSchema,
} from '../../../src/api/trpc/clients/schema.client';
import { server } from '../../msw-server';
import { trpcMswBatch, unwrapBatchInput } from '../../trpc-msw-batch';

describe('schema client', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getActionsSchema calls schema.getActionsSchema query', async () => {
    const mockResponse = { click: { schema: {} } };
    const spy = vi.fn().mockReturnValue(mockResponse);
    server.use(trpcMswBatch.schema.getActionsSchema.query(() => spy() as any));

    const result = await getActionsSchema();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResponse);
  });

  it('getSchema calls schema.getSchema mutation', async () => {
    const mockResponse = { properties: {}, type: 'object' };
    const spy = vi.fn().mockReturnValue(mockResponse);
    server.use(
      trpcMswBatch.schema.getSchema.mutation(
        ({ input }) => spy(unwrapBatchInput(input)) as any,
      ),
    );

    const input = { schemaName: 'browser-options' };
    const result = await getSchema(input as any);

    expect(spy).toHaveBeenCalledWith(input);
    expect(result).toEqual(mockResponse);
  });
});
