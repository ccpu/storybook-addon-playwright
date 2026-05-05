import { getStoryData } from '../../configs/story-data';
import { useCurrentStoryData as orgUseCurrentStoryData } from '../../../src/hooks/use-current-story-data';

const useCurrentStoryData = vi.fn<typeof orgUseCurrentStoryData>();

useCurrentStoryData.mockImplementation(
  () =>
    ({
      ...getStoryData(),
      fileName: 'story.stories.tsx',
    } as unknown as ReturnType<typeof orgUseCurrentStoryData>),
);

export { useCurrentStoryData };
