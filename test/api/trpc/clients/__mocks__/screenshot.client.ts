export const getScreenshot: (...args: unknown[]) => Promise<unknown> = vi.fn();
export const saveScreenshot: (...args: unknown[]) => Promise<unknown> = vi.fn();
export const deleteScreenshot: (...args: unknown[]) => Promise<unknown> = vi.fn();
export const updateScreenshot: (...args: unknown[]) => Promise<unknown> = vi.fn();
export const testScreenshot: (...args: unknown[]) => Promise<unknown> = vi.fn();
export const getStoryScreenshots: (...args: unknown[]) => Promise<unknown> = vi.fn();
export const deleteStoryScreenshots: (...args: unknown[]) => Promise<unknown> = vi.fn();
export const changeScreenShotIndex: (...args: unknown[]) => Promise<unknown> = vi.fn();
export const testStoryScreenshots: (...args: unknown[]) => Promise<unknown> = vi.fn();
export const testScreenshots: (...args: unknown[]) => Promise<unknown> = vi.fn();

vi.mocked(testScreenshot).mockImplementation(() =>
  Promise.resolve({
    filePath: './test.stories.tsx',
    newScreenshot: 'base64-image',
    pass: true,
    screenshotId: 'screenshot-id',
    storyId: 'story-id',
  }),
);

vi.mocked(testScreenshots).mockImplementation(() => Promise.resolve([{ pass: true }]));
