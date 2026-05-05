import { useStoryActionSetsLoader as orgUseStoryActionSetsLoader } from '../../../../../src/features/action-set/hooks/use-story-action-sets-loader';

export const useStoryActionSetsLoader = vi
  .fn<typeof orgUseStoryActionSetsLoader>()
  .mockImplementation(() => ({
    loading: false,
    retry: vi.fn(),
  }));
