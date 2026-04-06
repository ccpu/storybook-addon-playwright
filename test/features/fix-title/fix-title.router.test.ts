import { fixTitleRouter } from '../../../src/api/trpc/routers/fix-title.router';
import { createCallerFactory } from '../../../src/api/trpc/trpc';
import { fixScreenshotFileName } from '../../../src/api/services/fix-screenshot-file-name';

vi.mock('../../../src/api/services/fix-screenshot-file-name');

const createCaller = createCallerFactory(fixTitleRouter);
const caller = createCaller({} as any);

describe('fixTitleRouter', () => {
  beforeEach(() => vi.clearAllMocks());

  it('fixScreenshotFileName calls fixScreenshotFileName service', async () => {
    const mockResult = { renamed: true };
    (fixScreenshotFileName as Mock).mockResolvedValue(mockResult);

    const input = {
      id: 'parent--new-name',
      parameters: { fileName: 'file.ts' },
      parent: 'parent',
      previousNamedExport: 'OldName',
    };

    const result = await caller.fixScreenshotFileName(input);

    expect(fixScreenshotFileName).toHaveBeenCalledWith(input);
    expect(result).toEqual(mockResult);
  });
});
