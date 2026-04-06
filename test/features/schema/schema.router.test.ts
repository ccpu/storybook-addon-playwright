import { schemaRouter } from '../../../src/api/trpc/routers/schema.router';
import { createCallerFactory } from '../../../src/api/trpc/trpc';
import { getActionsSchema } from '../../../src/api/services/get-actions-schema';
import { getSchemaService } from '../../../src/api/services/get-schema-service';

vi.mock('../../../src/api/services/get-actions-schema');
vi.mock('../../../src/api/services/get-schema-service');

const createCaller = createCallerFactory(schemaRouter);
const caller = createCaller({} as any);

describe('schemaRouter', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getActionsSchema calls getActionsSchema service', async () => {
    const mockResult = { click: { schema: {} } };
    (getActionsSchema as Mock).mockReturnValue(mockResult);

    const result = await caller.getActionsSchema();

    expect(getActionsSchema).toHaveBeenCalled();
    expect(result).toEqual(mockResult);
  });

  it('getSchema calls getSchemaService service with schemaName', async () => {
    const mockResult = { properties: {}, type: 'object' };
    (getSchemaService as Mock).mockReturnValue(mockResult);

    const result = await caller.getSchema({ schemaName: 'browser-options' });

    expect(getSchemaService).toHaveBeenCalledWith('browser-options');
    expect(result).toEqual(mockResult);
  });
});
