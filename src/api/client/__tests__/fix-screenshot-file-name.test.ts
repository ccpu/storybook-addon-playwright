import { fixScreenshotFileName } from '../fix-screenshot-file-name';
import fetch from 'jest-fetch-mock';
import { getStoryData } from '../../../../__test_data__/story-data';

describe('fixScreenshotFileName', () => {
  beforeEach(() => {
    fetch.doMock();
  });
  it('should be defined', () => {
    expect(fixScreenshotFileName).toBeDefined();
  });

  it('should have response', async () => {
    fetch.mockResponseOnce(JSON.stringify(getStoryData()));
    const res = await fixScreenshotFileName(getStoryData());
    expect(res).toStrictEqual(getStoryData());
  });
});
