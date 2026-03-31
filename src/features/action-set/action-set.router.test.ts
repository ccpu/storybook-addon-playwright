import { actionSetRouter } from './action-set.router';
import { createCallerFactory } from '../../trpc/trpc';
import * as service from './action-set.service';

vi.mock('./action-set.service');

const createCaller = createCallerFactory(actionSetRouter);
const caller = createCaller({} as any);

describe('actionSetRouter', () => {
  beforeEach(() => vi.clearAllMocks());

  it('saveActionSet calls saveActionSet service', async () => {
    (service.saveActionSet as Mock).mockResolvedValue(undefined);

    const input = {
      actionSet: { actions: [], id: 'as-1' },
      fileName: 'file.ts',
      storyId: 'story--name',
    };

    const result = await caller.saveActionSet(input);

    expect(service.saveActionSet).toHaveBeenCalledWith(input);
    expect(result).toBeUndefined();
  });

  it('getActionSet calls getActionSet service', async () => {
    const mockResult = [{ actions: [], id: 'as-1' }];
    (service.getActionSet as Mock).mockResolvedValue(mockResult);

    const input = { fileName: 'file.ts', storyId: 'story--name' };
    const result = await caller.getActionSet(input);

    expect(service.getActionSet).toHaveBeenCalledWith(input);
    expect(result).toEqual(mockResult);
  });

  it('deleteActionSet calls deleteActionSet service', async () => {
    (service.deleteActionSet as Mock).mockResolvedValue(undefined);

    const input = {
      actionSetId: 'as-1',
      fileName: 'file.ts',
      storyId: 'story--name',
    };

    const result = await caller.deleteActionSet(input);

    expect(service.deleteActionSet).toHaveBeenCalledWith(input);
    expect(result).toBeUndefined();
  });
});
