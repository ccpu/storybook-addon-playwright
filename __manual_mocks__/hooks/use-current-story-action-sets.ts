import { ActionSet } from '../../src/typings';

export const useCurrentStoryActionSetsMock = vi.fn();

vi.mock('../../src/hooks/use-current-story-action-sets', () => ({
  useCurrentStoryActionSets: useCurrentStoryActionSetsMock,
}));

useCurrentStoryActionSetsMock.mockImplementation(() => ({
  currentActionSets: ['action-set-id'],
  storyActionSets: [
    {
      actions: [
        {
          id: 'action-id',
          name: 'click',
        },
      ],
      id: 'action-set-id',
    },
  ] as ActionSet[],
}));
