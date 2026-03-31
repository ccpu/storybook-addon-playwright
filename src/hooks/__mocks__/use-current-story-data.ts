import { getStoryData } from '../../../__test_data__/story-data';

const useCurrentStoryData = vi.fn();

useCurrentStoryData.mockImplementation(() => getStoryData());

export { useCurrentStoryData };
