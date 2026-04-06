// Changed: vi.hoisted() ensures the variable is initialized before the Mock
// factory runs (vitest hoists vi.mock to before all declarations, causing TDZ).
const spyOnRmdirSyncMock = vi.hoisted(() => vi.fn());
vi.mock('fs', () => ({
  existsSync: () => {
    return true;
  },
  rmdirSync: spyOnRmdirSyncMock,
}));
import { runDiffImageToSnapshotMock } from '../../manual-mocks/jest-image-snapshot';
import { diffImageToScreenshot } from '../../../src/api/services/diff-image-to-screenshot';
import * as configs from '../../../src/api/server/configs';
import { Page } from 'playwright';
import { DiffImageToScreenShot } from '../../../src/api/typings';

vi.mock(
  '../../../src/api/server/configs',
  async () => await import('../server/__mocks__/configs'),
);
const configsMock = configs as unknown as Mocked<typeof configs>;

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

  it('should have diff result in vertical', async () => {
    const result = await diffImageToScreenshot(diffData, new Buffer('image'));

    expect(result).toStrictEqual({ added: true, diffDirection: undefined });
    const [data] = runDiffImageToSnapshotMock.mock.calls[0] as unknown as [
      {
        diffDirection?: string;
      },
    ];
    expect(data.diffDirection).toBe('horizontal');
  });

  it('should have diff result in horizontal', async () => {
    configsMock.getConfigs.mockImplementationOnce(() => ({
      diffDirection: 'horizontal',
      getPage: async () => {
        return {} as Page;
      },
      storybookEndpoint: 'localhost',
    }));

    const result = await diffImageToScreenshot(diffData, new Buffer('image'));

    expect(result).toStrictEqual({ added: true, diffDirection: 'horizontal' });
    const [data] = runDiffImageToSnapshotMock.mock.calls[0] as unknown as [
      {
        diffDirection?: string;
      },
    ];
    expect(data.diffDirection).toBe('horizontal');
  });

  it('should delete diff file', async () => {
    runDiffImageToSnapshotMock.mockImplementation(() => {
      return {
        pass: false,
      };
    });

    const result = await diffImageToScreenshot(diffData, new Buffer('image'));

    expect(result).toStrictEqual({ diffDirection: undefined, pass: false });

    expect(spyOnRmdirSyncMock).toHaveBeenCalledTimes(1);
  });
});
