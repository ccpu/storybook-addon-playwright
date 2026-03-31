import { fixTitleRouter } from './fix-title.router';
import { createCallerFactory } from '../../trpc/trpc';
import * as service from './fix-title.service';

vi.mock('./fix-title.service');

const createCaller = createCallerFactory(fixTitleRouter);
const caller = createCaller({} as any);

describe('fixTitleRouter', () => {
  beforeEach(() => vi.clearAllMocks());

  it('fixScreenshotFileName calls fixScreenshotFileName service', async () => {
    const mockResult = { renamed: true };
    (service.fixScreenshotFileName as Mock).mockResolvedValue(mockResult);

    const input = {
      id: 'parent--new-name',
      parameters: { fileName: 'file.ts' },
      parent: 'parent',
      previousNamedExport: 'OldName',
    };

    const result = await caller.fixScreenshotFileName(input);

    expect(service.fixScreenshotFileName).toHaveBeenCalledWith(input);
    expect(result).toEqual(mockResult);
  });
});
