import { mocked } from 'ts-jest/utils';

export const getScreenshot = jest.fn();
export const saveScreenshot = jest.fn();
export const deleteScreenshot = jest.fn();
export const updateScreenshot = jest.fn();
export const testScreenshot = jest.fn();
export const getStoryScreenshots = jest.fn();
export const deleteStoryScreenshots = jest.fn();
export const changeScreenShotIndex = jest.fn();
export const testStoryScreenshots = jest.fn();
export const testScreenshots = jest.fn();

mocked(testScreenshot).mockImplementation(() =>
  Promise.resolve({
    fileName: './test.stories.tsx',
    newScreenshot: 'base64-image',
    pass: true,
    screenshotId: 'screenshot-id',
    storyId: 'story-id',
  }),
);

mocked(testScreenshots).mockImplementation(() =>
  Promise.resolve([{ pass: true }]),
);
