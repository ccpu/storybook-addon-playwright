vi.mock('../../trpc/client');

import { trpc } from '../../trpc/client';
import { getActionsSchema, getSchema } from './schema.client';

describe('schema client', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getActionsSchema calls trpc.schema.getActionsSchema.query', async () => {
    const mockResponse = { click: { schema: {} } };
    (trpc.schema.getActionsSchema.query as Mock).mockResolvedValueOnce(
      mockResponse,
    );

    const result = await getActionsSchema();

    expect(trpc.schema.getActionsSchema.query).toHaveBeenCalled();
    expect(result).toEqual(mockResponse);
  });

  it('getSchema calls trpc.schema.getSchema.mutate', async () => {
    const mockResponse = { properties: {}, type: 'object' };
    (trpc.schema.getSchema.mutate as Mock).mockResolvedValueOnce(mockResponse);

    const input = { schemaName: 'browser-options' };
    const result = await getSchema(input as any);

    expect(trpc.schema.getSchema.mutate).toHaveBeenCalledWith(input);
    expect(result).toEqual(mockResponse);
  });
});
