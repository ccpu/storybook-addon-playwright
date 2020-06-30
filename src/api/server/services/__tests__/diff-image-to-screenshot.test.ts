const spyOnRmdirSyncMock = jest.fn();
jest.mock('fs', () => ({
  rmdirSync: spyOnRmdirSyncMock,
}));
import { runDiffImageToSnapshotMock } from '../../../../../__manual_mocks__/jest-image-snapshot';
import { diffImageToScreenshot } from '../diff-image-to-screenshot';
import * as configs from '../../configs';
import { Page } from 'playwright-core';
import { DiffImageToScreenShot } from '../../../typings';

jest.mock('../../configs');
const configsMock = (configs as unknown) as jest.Mocked<typeof configs>;

describe('diffImageToScreenshot', () => {
  const diffData: DiffImageToScreenShot = {
    browserType: 'chromium',
    fileName: 'story-ts',
    storyId: 'story-id',
    title: 'title',
  };

  beforeAll(() => {
    configsMock.getConfigs.mockImplementation(() => ({
      getPage: async () => {
        return {} as Page;
      },
      storybookEndpoint: 'localhost',
    }));
  });

  beforeEach(() => {
    runDiffImageToSnapshotMock.mockClear();
    spyOnRmdirSyncMock.mockClear();
  });

  afterAll(() => {
    runDiffImageToSnapshotMock.mockRestore();
    spyOnRmdirSyncMock.mockRestore();
  });

  it('should have diff result in vertical', () => {
    const result = diffImageToScreenshot(diffData, new Buffer('image'));

    expect(result).toStrictEqual({ added: true, diffDirection: undefined });
    const data = runDiffImageToSnapshotMock.mock.calls[0][0];
    expect(data.diffDirection).toBe('vertical');
  });

  it('should have diff result in horizontal', () => {
    configsMock.getConfigs.mockImplementationOnce(() => ({
      diffDirection: 'horizontal',
      getPage: async () => {
        return {} as Page;
      },
      storybookEndpoint: 'localhost',
    }));

    const result = diffImageToScreenshot(diffData, new Buffer('image'));

    expect(result).toStrictEqual({ added: true, diffDirection: 'horizontal' });
    const data = runDiffImageToSnapshotMock.mock.calls[0][0];
    expect(data.diffDirection).toBe('horizontal');
  });

  it('should delete diff file', () => {
    runDiffImageToSnapshotMock.mockImplementation(() => {
      return {
        pass: false,
      };
    });

    const result = diffImageToScreenshot(diffData, new Buffer('image'));

    expect(result).toStrictEqual({ diffDirection: undefined, pass: false });

    expect(spyOnRmdirSyncMock).toHaveBeenCalledTimes(1);
  });
});
