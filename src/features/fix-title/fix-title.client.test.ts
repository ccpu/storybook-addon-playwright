jest.mock('../../trpc/client');

import { trpc } from '../../trpc/client';
import { fixScreenshotFileName } from './fix-title.client';

describe('fix-title client', () => {
  beforeEach(() => jest.clearAllMocks());

  it('fixScreenshotFileName calls trpc.fixTitle.fixScreenshotFileName.mutate', async () => {
    const mockResponse = { renamed: true };
    (
      trpc.fixTitle.fixScreenshotFileName.mutate as jest.Mock
    ).mockResolvedValueOnce(mockResponse);

    const input = {
      parameters: { fileName: 'file.ts' },
      previousNamedExport: 'OldName',
      id: 'parent--new-name',
      parent: 'parent',
    };

    const result = await fixScreenshotFileName(input as any);

    expect(trpc.fixTitle.fixScreenshotFileName.mutate).toHaveBeenCalledWith(
      input,
    );
    expect(result).toEqual(mockResponse);
  });

  it('fixScreenshotFileName resolves without error', async () => {
    (
      trpc.fixTitle.fixScreenshotFileName.mutate as jest.Mock
    ).mockResolvedValueOnce(undefined);

    await expect(
      fixScreenshotFileName({
        parameters: { fileName: 'file.ts' },
        id: 'parent--name',
        parent: 'parent',
      } as any),
    ).resolves.toBeUndefined();
  });
});
