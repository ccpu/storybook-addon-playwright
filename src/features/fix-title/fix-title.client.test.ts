vi.mock('../../trpc/client');

import { trpc } from '../../trpc/client';
import { fixScreenshotFileName } from './fix-title.client';

describe('fix-title client', () => {
  beforeEach(() => vi.clearAllMocks());

  it('fixScreenshotFileName calls trpc.fixTitle.fixScreenshotFileName.mutate', async () => {
    const mockResponse = { renamed: true };
    (trpc.fixTitle.fixScreenshotFileName.mutate as Mock).mockResolvedValueOnce(
      mockResponse,
    );

    const input = {
      id: 'parent--new-name',
      parameters: { fileName: 'file.ts' },
      parent: 'parent',
      previousNamedExport: 'OldName',
    };

    const result = await fixScreenshotFileName(input as any);

    expect(trpc.fixTitle.fixScreenshotFileName.mutate).toHaveBeenCalledWith(
      input,
    );
    expect(result).toEqual(mockResponse);
  });

  it('fixScreenshotFileName resolves without error', async () => {
    (trpc.fixTitle.fixScreenshotFileName.mutate as Mock).mockResolvedValueOnce(
      undefined,
    );

    await expect(
      fixScreenshotFileName({
        id: 'parent--name',
        parameters: { fileName: 'file.ts' },
        parent: 'parent',
      } as any),
    ).resolves.toBeUndefined();
  });
});
