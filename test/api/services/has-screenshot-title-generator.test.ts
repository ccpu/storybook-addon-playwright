import { hasScreenshotTitleGenerator } from '../../../src/api/services/has-screenshot-title-generator';

vi.mock(
  '../../../src/api/server/configs',
  async () => await import('../server/__mocks__/configs'),
);

describe('hasScreenshotTitleGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return false when getScreenshotTitle is not configured', async () => {
    const { getConfigs } = await import('../../../src/api/server/configs');
    vi.mocked(getConfigs).mockReturnValue({
      getPage: vi.fn(),
      storybookEndpoint: 'localhost:5000',
      concurrencyLimit: { file: 1, story: 1 },
    } as never);

    expect(hasScreenshotTitleGenerator()).toBe(false);
  });

  it('should return true when getScreenshotTitle is configured', async () => {
    const { getConfigs } = await import('../../../src/api/server/configs');
    vi.mocked(getConfigs).mockReturnValue({
      getPage: vi.fn(),
      getScreenshotTitle: async () => 'title',
      storybookEndpoint: 'localhost:5000',
      concurrencyLimit: { file: 1, story: 1 },
    } as never);

    expect(hasScreenshotTitleGenerator()).toBe(true);
  });
});
