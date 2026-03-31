import { toMatchScreenshots } from '../to-match-screenshots';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

vi.mock('../api/server/utils/load-story-data.ts');
vi.mock('../api/server/services/make-screenshot.ts');

describe('toMatchScreenshots', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('should pass', async () => {
    const successMockData = {
      message: () => 'mock passed',
      pass: true,
    };
    (toMatchImageSnapshot as Mock)
      .mockImplementationOnce(() => successMockData)
      .mockImplementationOnce(() => successMockData);

    const result = await toMatchScreenshots.call(
      { currentTestName: 'test-name', testPath: 'file.test.ts' },
      'test.playwright.json',
    );

    expect(result.pass).toBeTruthy();
    expect(result.message()).toBe('expected page screenshot to match.');
  });
  it('should fail', async () => {
    const failMockData = {
      message: () => 'mock failed',
      pass: false,
    };

    (toMatchImageSnapshot as Mock)
      .mockImplementationOnce(() => failMockData)
      .mockImplementationOnce(() => failMockData);

    const result = await toMatchScreenshots.call(
      { testPath: 'file.test.ts' },
      'test.playwright.json',
    );
    expect(result.pass).toBeFalsy();
    expect(result.message()).toBe('mock failed');
  });
});
