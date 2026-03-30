import { fixTitleRouter } from './fix-title.router';
import { createCallerFactory } from '../../trpc/trpc';
import * as service from './fix-title.service';

jest.mock('./fix-title.service');

const createCaller = createCallerFactory(fixTitleRouter);
const caller = createCaller({} as any);

describe('fixTitleRouter', () => {
  beforeEach(() => jest.clearAllMocks());

  it('fixScreenshotFileName calls fixScreenshotFileName service', async () => {
    const mockResult = { renamed: true };
    (service.fixScreenshotFileName as jest.Mock).mockResolvedValue(mockResult);

    const input = {
      parameters: { fileName: 'file.ts' },
      previousNamedExport: 'OldName',
      id: 'parent--new-name',
      parent: 'parent',
    };

    const result = await caller.fixScreenshotFileName(input);

    expect(service.fixScreenshotFileName).toHaveBeenCalledWith(input);
    expect(result).toEqual(mockResult);
  });
});
