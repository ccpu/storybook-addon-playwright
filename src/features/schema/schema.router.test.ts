import { schemaRouter } from './schema.router';
import { createCallerFactory } from '../../trpc/trpc';
import * as service from './schema.service';

jest.mock('./schema.service');

const createCaller = createCallerFactory(schemaRouter);
const caller = createCaller({} as any);

describe('schemaRouter', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getActionsSchema calls getActionsSchema service', async () => {
    const mockResult = { click: { schema: {} } };
    (service.getActionsSchema as jest.Mock).mockReturnValue(mockResult);

    const result = await caller.getActionsSchema();

    expect(service.getActionsSchema).toHaveBeenCalled();
    expect(result).toEqual(mockResult);
  });

  it('getSchema calls getSchema service with schemaName', async () => {
    const mockResult = { type: 'object', properties: {} };
    (service.getSchema as jest.Mock).mockReturnValue(mockResult);

    const result = await caller.getSchema({ schemaName: 'browser-options' });

    expect(service.getSchema).toHaveBeenCalledWith('browser-options');
    expect(result).toEqual(mockResult);
  });
});
