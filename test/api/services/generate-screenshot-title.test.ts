import { generateScreenshotTitle } from '../../../src/api/services/generate-screenshot-title';

vi.mock(
  '../../../src/api/server/configs',
  async () => await import('../server/__mocks__/configs'),
);

const mockGetScreenshotTitle = vi.fn<() => Promise<string>>();

describe('generateScreenshotTitle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw when getScreenshotTitle is not configured', async () => {
    await expect(
      generateScreenshotTitle({
        browser: {
          type: 'chromium',
        },
        story: {
          filePath: 'story.ts',
          id: 'story--name',
          name: 'MyStory',
          title: 'Story Title',
        },
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

    mockGetScreenshotTitle.mockResolvedValue('Generated Title');

    const result = await generateScreenshotTitle({
      browser: {
        type: 'chromium',
      },
      story: {
        changedArgs: { color: 'red' },
        filePath: 'src/story.tsx',
        id: 'story--name',
        initialArgs: { color: 'red', size: 'large' },
        name: 'MyStory',
        title: 'Story Title',
      },
    });

    expect(result).toBe('Generated Title');
    expect(mockGetScreenshotTitle).toHaveBeenCalledWith({
      browser: {
        type: 'chromium',
      },
      story: {
        changedArgs: { color: 'red' },
        filePath: 'src/story.tsx',
        id: 'story--name',
        initialArgs: { color: 'red', size: 'large' },
        name: 'MyStory',
        title: 'Story Title',
      },
    });
  });

  it('should pass through story data when the file cannot be read', async () => {
    const { getConfigs } = await import('../../../src/api/server/configs');
    vi.mocked(getConfigs).mockReturnValue({
      getPage: vi.fn(),
      getScreenshotTitle: mockGetScreenshotTitle,
      storybookEndpoint: 'localhost:5000',
      concurrencyLimit: { file: 1, story: 1 },
    } as never);

    mockGetScreenshotTitle.mockResolvedValue('Fallback Title');

    const result = await generateScreenshotTitle({
      browser: {
        type: 'firefox',
      },

      story: {
        filePath: 'missing.ts',
        id: 'story--id',
        name: 'MissingStory',
        title: 'Missing Story Title',
      },
    });

    expect(result).toBe('Fallback Title');
    expect(mockGetScreenshotTitle).toHaveBeenCalledWith({
      browser: {
        type: 'firefox',
      },

      story: {
        filePath: 'missing.ts',
        id: 'story--id',
        name: 'MissingStory',
        title: 'Missing Story Title',
      },
    });
  });
});
