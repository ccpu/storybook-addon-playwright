vi.mock(
  '../../../src/api/trpc/client',
  async () => await import('../../api/trpc/__mocks__/client'),
);

import { trpc } from '../../../src/api/trpc/client';
import {
  saveActionSet,
  getActionSet,
  deleteActionSet,
} from '../../../src/api/trpc/clients/action-set.client';

describe('action-set client', () => {
  beforeEach(() => vi.clearAllMocks());

  it('saveActionSet calls trpc.actionSet.saveActionSet.mutate', async () => {
    (trpc.actionSet.saveActionSet.mutate as Mock).mockResolvedValueOnce(
      undefined,
    );

    const input = {
      actionSet: { actions: [], id: 'as-1' },
      fileName: 'file.ts',
      storyId: 'story--name',
    };

    await expect(saveActionSet(input as any)).resolves.toBeUndefined();
    expect(trpc.actionSet.saveActionSet.mutate).toHaveBeenCalledWith(input);
  });

  it('getActionSet calls trpc.actionSet.getActionSet.mutate', async () => {
    const mockResponse = [{ actions: [], id: 'as-1' }];
    (trpc.actionSet.getActionSet.mutate as Mock).mockResolvedValueOnce(
      mockResponse,
    );

    const input = { fileName: 'file.ts', storyId: 'story--name' };
    const result = await getActionSet(input as any);

    expect(trpc.actionSet.getActionSet.mutate).toHaveBeenCalledWith(input);
    expect(result).toEqual(mockResponse);
  });

  it('deleteActionSet calls trpc.actionSet.deleteActionSet.mutate', async () => {
    (trpc.actionSet.deleteActionSet.mutate as Mock).mockResolvedValueOnce(
      undefined,
    );

    const input = {
      actionSetId: 'as-1',
      fileName: 'file.ts',
      storyId: 'story--name',
    };

    await expect(deleteActionSet(input as any)).resolves.toBeUndefined();
    expect(trpc.actionSet.deleteActionSet.mutate).toHaveBeenCalledWith(input);
  });
});
