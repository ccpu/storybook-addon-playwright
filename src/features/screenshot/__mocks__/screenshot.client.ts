export const getScreenshot = vi.fn();
export const saveScreenshot = vi.fn();
export const deleteScreenshot = vi.fn();
export const updateScreenshot = vi.fn();
export const testScreenshot = vi.fn();
export const getStoryScreenshots = vi.fn();
export const deleteStoryScreenshots = vi.fn();
export const changeScreenShotIndex = vi.fn();
export const testStoryScreenshots = vi.fn();
export const testScreenshots = vi.fn();

vi.mocked(testScreenshot).mockImplementation(() =>
  Promise.resolve({
    fileName: './test.stories.tsx',
    newScreenshot: 'base64-image',
    pass: true,
    screenshotId: 'screenshot-id',
    storyId: 'story-id',
  }),
);

vi.mocked(testScreenshots).mockImplementation(() =>
  Promise.resolve([{ pass: true }]),
);
