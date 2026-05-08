import { generateScreenshotTitle } from '../../../src/api/services/generate-screenshot-title';
import fs from 'node:fs';

vi.mock(
  '../../../src/api/server/configs',
  async () => await import('../server/__mocks__/configs'),
);

vi.mock('node:fs');

const mockGetScreenshotTitle = vi.fn<() => Promise<string>>();

describe('generateScreenshotTitle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw when getScreenshotTitle is not configured', async () => {
    await expect(
      generateScreenshotTitle({
        browserType: 'chromium',
        filePath: 'story.ts',
        storyId: 'story--name',
      }),
    ).rejects.toThrow('getScreenshotTitle is not configured.');
  });

  it('should call getScreenshotTitle with story data and return the title', async () => {
    const { getConfigs } = await import('../../../src/api/server/configs');
    vi.mocked(getConfigs).mockReturnValue({
      getPage: vi.fn(),
      getScreenshotTitle: mockGetScreenshotTitle,
      storybookEndpoint: 'localhost:5000',
      concurrencyLimit: { file: 1, story: 1 },
    } as never);

    vi.mocked(fs.readFileSync).mockReturnValue('export const MyStory = () => <div />;');
    mockGetScreenshotTitle.mockResolvedValue('Generated Title');

    const result = await generateScreenshotTitle({
      args: { color: 'red' },
      browserType: 'chromium',
      filePath: 'src/story.tsx',
      props: { size: 'large' },
      storyId: 'story--name',
    });

    expect(result).toBe('Generated Title');
    expect(mockGetScreenshotTitle).toHaveBeenCalledWith({
      args: { color: 'red' },
      browserType: 'chromium',
      filePath: 'src/story.tsx',
      props: { size: 'large' },
      storyId: 'story--name',
      storySource: 'export const MyStory = () => <div />;',
    });
  });

  it('should pass undefined storySource when file cannot be read', async () => {
    const { getConfigs } = await import('../../../src/api/server/configs');
    vi.mocked(getConfigs).mockReturnValue({
      getPage: vi.fn(),
      getScreenshotTitle: mockGetScreenshotTitle,
      storybookEndpoint: 'localhost:5000',
      concurrencyLimit: { file: 1, story: 1 },
    } as never);

    vi.mocked(fs.readFileSync).mockImplementation(() => {
      throw new Error('ENOENT');
    });
    mockGetScreenshotTitle.mockResolvedValue('Fallback Title');

    const result = await generateScreenshotTitle({
      browserType: 'firefox',
      filePath: 'missing.ts',
      storyId: 'story--id',
    });

    expect(result).toBe('Fallback Title');
    expect(mockGetScreenshotTitle).toHaveBeenCalledWith(
      expect.objectContaining({ storySource: undefined }),
    );
  });
});
