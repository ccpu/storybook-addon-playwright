import { getStoryData } from '../../configs/story-data';

const useCurrentStoryData = vi.fn();

useCurrentStoryData.mockImplementation(() => getStoryData());

export { useCurrentStoryData };
