import { actionSetRouter } from '../../../src/api/trpc/routers/action-set.router';
import { createCallerFactory } from '../../../src/api/trpc/trpc';
import { saveActionSet } from '../../../src/api/services/save-action-set';
import { getActionSet } from '../../../src/api/services/get-action-set';
import { deleteActionSet } from '../../../src/api/services/delete-action-set';

vi.mock('../../../src/api/services/save-action-set');
vi.mock('../../../src/api/services/get-action-set');
vi.mock('../../../src/api/services/delete-action-set');

const createCaller = createCallerFactory(actionSetRouter);
const caller = createCaller({} as any);

describe('actionSetRouter', () => {
  beforeEach(() => vi.clearAllMocks());

  it('saveActionSet calls saveActionSet service', async () => {
    (saveActionSet as Mock).mockResolvedValue(undefined);

    const input = {
      actionSet: { actions: [], id: 'as-1', title: 'title' },
      filePath: 'file.ts',
      storyId: 'story--name',
    };

    const result = await caller.saveActionSet(input);

    expect(saveActionSet).toHaveBeenCalledWith(input);
    expect(result).toBeUndefined();
  });

  it('getActionSet calls getActionSet service', async () => {
    const mockResult = [{ actions: [], id: 'as-1' }];
    (getActionSet as Mock).mockResolvedValue(mockResult);

    const input = { filePath: 'file.ts', storyId: 'story--name' };
    const result = await caller.getActionSet(input);

    expect(getActionSet).toHaveBeenCalledWith(input);
    expect(result).toEqual(mockResult);
  });

  it('deleteActionSet calls deleteActionSet service', async () => {
    (deleteActionSet as Mock).mockResolvedValue(undefined);

    const input = {
      actionSetId: 'as-1',
      filePath: 'file.ts',
      storyId: 'story--name',
    };

    const result = await caller.deleteActionSet(input);

    expect(deleteActionSet).toHaveBeenCalledWith(input);
    expect(result).toBeUndefined();
  });
});
