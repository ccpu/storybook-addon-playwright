import { fixTitleRouter } from '../../../src/api/trpc/routers/fix-title.router';
import { createCallerFactory } from '../../../src/api/trpc/trpc';
import { fixScreenshotFileName } from '../../../src/api/services/fix-screenshot-file-name';

vi.mock('../../../src/api/services/fix-screenshot-file-name');

const createCaller = createCallerFactory(fixTitleRouter);
const caller = createCaller({} as any);

describe('fixTitleRouter', () => {
  beforeEach(() => vi.clearAllMocks());

  const input = {
    filePath: 'file.ts',
    id: 'parent--new-name',
    name: 'new-name',
    parent: 'parent',
    previousNamedExport: 'OldName',
  };

  it('fixScreenshotFileName calls fixScreenshotFileName service', async () => {
    const mockResult = { renamed: true };
    (fixScreenshotFileName as Mock).mockResolvedValue(mockResult);

    const result = await caller.fixScreenshotFileName(input);

    expect(fixScreenshotFileName).toHaveBeenCalledWith(input);
    expect(result).toEqual(mockResult);
  });

  it('should propagate service errors', async () => {
    const error = new Error('rename failed');
    (fixScreenshotFileName as Mock).mockRejectedValue(error);

    await expect(caller.fixScreenshotFileName(input)).rejects.toThrow('rename failed');
  });

  it('should validate input before calling service', async () => {
    await expect(
      caller.fixScreenshotFileName({
        filePath: 'file.ts',
      } as never),
    ).rejects.toThrow();

    expect(fixScreenshotFileName).not.toHaveBeenCalled();
  });
});
