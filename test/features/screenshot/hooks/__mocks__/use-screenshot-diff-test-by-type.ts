import { useScreenshotDiffTestByType as orgUseScreenshotDiffTestByType } from '../../../../../src/hooks';

const useScreenshotDiffTestByType =
  vi.fn<typeof orgUseScreenshotDiffTestByType>();

useScreenshotDiffTestByType.mockImplementation(() => {
  return {
    imageDiffTestInProgress: false,
    storyData: {
      fileName: 'test.stories.tsx',
      filePath: './test.stories.tsx',
      id: 'story-id',
      name: 'Story Name',
      parent: 'Story Parent',
    },
    testStoryScreenShots: vi.fn(),
  };
});

export { useScreenshotDiffTestByType };
